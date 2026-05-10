<?php

namespace App\Console\Commands;

use App\Models\BdAppsEvent;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;

class ExportBdAppsEvents extends Command
{
    protected $signature = 'bdapps:export-events {limit=200} {--output=BDAPPS_API_EVENTS.md} {--unique : Export unique response types only}';
    protected $description = 'Export BdApps API events to Markdown file';

    public function handle()
    {
        if (!Schema::hasTable('bdapps_events')) {
            $this->error('Table bdapps_events does not exist!');
            return 1;
        }

        $limit = (int) $this->argument('limit');
        $outputFile = $this->option('output');
        $uniqueOnly = $this->option('unique');
        
        $this->info("Fetching last {$limit} BdApps events...");
        
        $events = BdAppsEvent::query()
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        if ($events->isEmpty()) {
            $this->warn('No events found in database.');
            return 0;
        }

        $this->info("Found {$events->count()} events. Generating Markdown...");

        if ($uniqueOnly) {
            $markdown = $this->generateUniqueResponsesMarkdown($events);
            $filename = str_replace('.md', '_UNIQUE.md', $outputFile);
        } else {
            $markdown = $this->generateMarkdown($events);
            $filename = $outputFile;
        }
        
        file_put_contents(base_path($filename), $markdown);
        
        $this->info("✅ Exported to: {$filename}");
        
        return 0;
    }

    private function generateMarkdown($events): string
    {
        $md = "# BdApps API Events Log\n\n";
        $md .= "**Generated:** " . now()->format('Y-m-d H:i:s') . "\n";
        $md .= "**Total Events:** " . $events->count() . "\n\n";
        $md .= "---\n\n";

        foreach ($events->reverse() as $index => $event) {
            $number = $index + 1;
            $md .= "## Event #{$number}\n\n";
            
            $md .= "**ID:** {$event->id}  \n";
            $md .= "**Direction:** {$event->direction}  \n";
            $md .= "**Service:** {$event->service}  \n";
            $md .= "**Method:** {$event->http_method}  \n";
            $md .= "**Status Code:** " . ($event->status_code ?? 'N/A') . "  \n";
            $md .= "**Timestamp:** {$event->created_at->format('Y-m-d H:i:s')}  \n";
            
            if ($event->url) {
                $md .= "**URL:** `{$event->url}`  \n";
            }
            
            $md .= "\n";

            // Request
            if ($event->request) {
                $md .= "### Request\n\n";
                $md .= "```json\n";
                $md .= json_encode($event->request, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $md .= "\n```\n\n";
            }

            // Response
            if ($event->response) {
                $md .= "### Response\n\n";
                $md .= "```json\n";
                $md .= json_encode($event->response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $md .= "\n```\n\n";
                
                // Extract key info for quick reference
                if (isset($event->response['statusCode'])) {
                    $md .= "**Response Status:** `{$event->response['statusCode']}`  \n";
                }
                if (isset($event->response['statusDetail'])) {
                    $md .= "**Status Detail:** `{$event->response['statusDetail']}`  \n";
                }
                if (isset($event->response['subscriptionStatus'])) {
                    $md .= "**Subscription Status:** `{$event->response['subscriptionStatus']}`  \n";
                }
                if (isset($event->response['subscriberId'])) {
                    $md .= "**Subscriber ID:** `{$event->response['subscriberId']}`  \n";
                }
                $md .= "\n";
            }

            // Error
            if ($event->error) {
                $md .= "### Error\n\n";
                $md .= "```\n{$event->error}\n```\n\n";
            }

            // Headers (optional, can be verbose)
            if ($event->headers && !empty($event->headers)) {
                $md .= "<details>\n<summary>Headers</summary>\n\n";
                $md .= "```json\n";
                $md .= json_encode($event->headers, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                $md .= "\n```\n</details>\n\n";
            }

            $md .= "---\n\n";
        }

        // Add summary statistics at the end
        $md .= "## Summary Statistics\n\n";
        
        $services = $events->groupBy('service')->map->count();
        $md .= "### Events by Service\n\n";
        foreach ($services as $service => $count) {
            $md .= "- **{$service}:** {$count}\n";
        }
        $md .= "\n";
        
        $statusCodes = $events->where('response', '!=', null)
            ->map(fn($e) => $e->response['statusCode'] ?? 'N/A')
            ->countBy()
            ->sortDesc();
        
        if ($statusCodes->isNotEmpty()) {
            $md .= "### Response Status Codes\n\n";
            foreach ($statusCodes as $code => $count) {
                $md .= "- **{$code}:** {$count}\n";
            }
            $md .= "\n";
        }

        return $md;
    }

    private function generateUniqueResponsesMarkdown($events): string
    {
        $md = "# BdApps API Unique Response Types\n\n";
        $md .= "**Generated:** " . now()->format('Y-m-d H:i:s') . "\n";
        $md .= "**Total Events Analyzed:** " . $events->count() . "\n\n";
        $md .= "This document shows unique response patterns from BdApps API.\n\n";
        $md .= "---\n\n";

        // Group by service
        $byService = $events->groupBy('service');

        foreach ($byService as $service => $serviceEvents) {
            $md .= "## Service: {$service}\n\n";
            $md .= "**Total Requests:** " . $serviceEvents->count() . "\n\n";

            // Find unique response patterns
            $uniqueResponses = [];
            
            foreach ($serviceEvents as $event) {
                if (!$event->response) continue;
                
                $statusCode = $event->response['statusCode'] ?? 'N/A';
                $statusDetail = $event->response['statusDetail'] ?? '';
                $subscriptionStatus = $event->response['subscriptionStatus'] ?? null;
                
                // Create signature for grouping
                $signature = $statusCode . '|' . strtolower(trim($statusDetail));
                if ($subscriptionStatus) {
                    $signature .= '|' . $subscriptionStatus;
                }
                
                if (!isset($uniqueResponses[$signature])) {
                    $uniqueResponses[$signature] = [
                        'count' => 0,
                        'statusCode' => $statusCode,
                        'statusDetail' => $statusDetail,
                        'subscriptionStatus' => $subscriptionStatus,
                        'example' => $event->response,
                        'firstSeen' => $event->created_at,
                        'lastSeen' => $event->created_at,
                        'sampleRequest' => $event->request,
                    ];
                }
                
                $uniqueResponses[$signature]['count']++;
                if ($event->created_at > $uniqueResponses[$signature]['lastSeen']) {
                    $uniqueResponses[$signature]['lastSeen'] = $event->created_at;
                }
            }

            // Sort by count descending
            uasort($uniqueResponses, fn($a, $b) => $b['count'] <=> $a['count']);

            $md .= "**Unique Response Patterns:** " . count($uniqueResponses) . "\n\n";

            foreach ($uniqueResponses as $signature => $pattern) {
                $md .= "### Pattern: {$pattern['statusCode']}\n\n";
                $md .= "**Occurrences:** {$pattern['count']}  \n";
                $md .= "**Status Code:** `{$pattern['statusCode']}`  \n";
                $md .= "**Status Detail:** `{$pattern['statusDetail']}`  \n";
                
                if ($pattern['subscriptionStatus']) {
                    $md .= "**Subscription Status:** `{$pattern['subscriptionStatus']}`  \n";
                }
                
                $md .= "**First Seen:** {$pattern['firstSeen']->format('Y-m-d H:i:s')}  \n";
                $md .= "**Last Seen:** {$pattern['lastSeen']->format('Y-m-d H:i:s')}  \n";
                $md .= "\n";

                // Sample request
                if ($pattern['sampleRequest']) {
                    $md .= "#### Sample Request\n\n";
                    $md .= "```json\n";
                    $md .= json_encode($pattern['sampleRequest'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    $md .= "\n```\n\n";
                }

                // Full response example
                $md .= "#### Full Response Example\n\n";
                $md .= "```json\n";
                $md .= json_encode($pattern['example'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $md .= "\n```\n\n";

                $md .= "---\n\n";
            }
        }

        return $md;
    }
}
