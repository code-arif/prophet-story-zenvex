<?php

namespace Database\Seeders;

use App\Models\SidebarMenu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class SidebarMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear cache
        Cache::forget('sidebar_menus');

        $menus = [
            ['name' => 'Dashboard', 'icon' => 'LayoutDashboard', 'path' => '/admin', 'permission' => 'view Dashboard'],
            
            [
                'name' => 'Content', 
                'icon' => 'FileText',
                'permission' => 'view Content',
                'children' => [
                    ['name' => 'Pages', 'path' => '/admin/pages', 'permission' => 'view Content'],
                    ['name' => 'Content Manager', 'path' => '/admin/content-manager', 'permission' => 'view Content'],
                    ['name' => 'Post Types', 'path' => '/admin/post-types', 'permission' => 'manage Content'],
                    ['name' => 'Taxonomies', 'path' => '/admin/taxonomies', 'permission' => 'manage Content'],
                ]
            ],
            
            [
                'name' => 'Media', 
                'icon' => 'Image',
                'permission' => 'view Media',
                'children' => [
                    ['name' => 'Media Manager', 'path' => '/admin/media', 'permission' => 'view Media'],
                    ['name' => 'APK Manager', 'path' => '/admin/apk', 'permission' => 'view Media'],
                ]
            ],
            
            [
                'name' => 'Subscribers', 
                'icon' => 'Users',
                'permission' => 'view Subscribers',
                'children' => [
                    ['name' => 'Subscribers', 'path' => '/admin/subscribers', 'permission' => 'view Subscribers'],
                    ['name' => 'Subscriptions', 'path' => '/admin/subscriptions', 'permission' => 'view Subscribers'],
                    ['name' => 'Feedbacks', 'path' => '/admin/feedbacks', 'permission' => 'view Subscribers'],
                    ['name' => 'Bulk SMS', 'path' => '/admin/sms/bulk', 'permission' => 'view Subscribers'],
                ]
            ],
            
            [
                'name' => 'System', 
                'icon' => 'Cpu',
                'permission' => 'manage System',
                'children' => [
                    ['name' => 'Users', 'path' => '/admin/users', 'permission' => 'manage System'],
                    ['name' => 'Logs', 'path' => '/admin/logs', 'permission' => 'manage System'],
                    ['name' => 'Roles', 'path' => '/admin/roles', 'permission' => 'manage Access Control'],
                    ['name' => 'Permissions', 'path' => '/admin/permissions', 'permission' => 'manage Access Control'],
                ]
            ],
            
            [
                'name' => 'Settings', 
                'icon' => 'Settings',
                'permission' => 'manage Settings',
                'children' => [
                    ['name' => 'General', 'path' => '/admin/settings/general', 'permission' => 'manage Settings'],
                    ['name' => 'SMTP / SMS', 'path' => '/admin/settings/integrations', 'permission' => 'manage Settings'],
                    ['name' => 'BDApps API', 'path' => '/admin/settings/bdapps', 'permission' => 'manage Settings'],
                    ['name' => 'USSD Menu', 'path' => '/admin/settings/ussd-menu', 'permission' => 'manage Settings'],
                ]
            ],
        ];

        $processedIds = [];

        foreach ($menus as $menu) {
            $children = $menu['children'] ?? null;
            unset($menu['children']);
            
            $parent = SidebarMenu::updateOrCreate(['name' => $menu['name']], $menu);
            $processedIds[] = $parent->id;
            
            if ($children) {
                foreach ($children as $child) {
                    $child['parent_id'] = $parent->id;
                    $childModel = SidebarMenu::updateOrCreate(
                        ['name' => $child['name'], 'parent_id' => $parent->id], 
                        $child
                    );
                    $processedIds[] = $childModel->id;
                }
            }
        }

        SidebarMenu::whereNotIn('id', $processedIds)->delete();
    }
}
