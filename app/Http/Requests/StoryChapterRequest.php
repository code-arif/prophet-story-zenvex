<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoryChapterRequest - Validates StoryChapter create/update submissions.
 *
 * Used by both store and update in AdminStoryChapterController.
 * `source_reference` is hard-required — a chapter can never be saved without
 * a citation, since it is the basis of content trust in this app.
 */
class StoryChapterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'prophet_id' => ['required', 'integer', 'exists:prophets,id'],
            'chapter_number' => ['required', 'integer', 'min:1', 'max:9999'],
            'title' => ['required', 'string', 'max:200'],
            'content_standard' => ['required', 'string'],
            'content_kid_friendly' => ['required', 'string'],
            'illustration_path' => ['nullable', 'string', 'max:500'],
            'audio_path' => ['nullable', 'string', 'max:500'],
            'moral_lesson' => ['required', 'string'],
            'source_reference' => ['required', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'prophet_id.required' => 'Please choose a Prophet.',
            'source_reference.required' => 'Source reference is required — every chapter needs a citation.',
            'content_kid_friendly.required' => 'The kid-friendly version is required (can start as a simplified copy of the standard text).',
        ];
    }
}