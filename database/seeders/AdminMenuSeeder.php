<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class AdminMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate existing items to start fresh
        if (Schema::hasTable('menus')) {
            Schema::disableForeignKeyConstraints();
            Menu::where('type', 'admin')->delete();
            Schema::enableForeignKeyConstraints();
        }

        // Seed default Admin Menus
        $adminMenu = [
            ['label' => 'Dashboard', 'href' => '/admin', 'roles' => ['admin']],
            [
                'label' => 'Content',
                'roles' => ['admin'],
                'children' => [
                    ['label' => 'Pages', 'href' => '/admin/pages', 'roles' => ['admin']],
                    ['label' => 'Content Manager', 'href' => '/admin/content-manager', 'roles' => ['admin']],
                    ['label' => 'Post Types', 'href' => '/admin/post-types', 'roles' => ['admin']],
                    ['label' => 'Taxonomies', 'href' => '/admin/taxonomies', 'roles' => ['admin']],
                ],
            ],
            [
                'label' => 'Media',
                'roles' => ['admin'],
                'children' => [
                    ['label' => 'Media Manager', 'href' => '/admin/media', 'roles' => ['admin']],
                    ['label' => 'APK Manager', 'href' => '/admin/apk', 'roles' => ['admin']],
                ],
            ],
            [
                'label' => 'Subscribers',
                'roles' => ['admin'],
                'children' => [
                    ['label' => 'Subscribers', 'href' => '/admin/subscribers', 'roles' => ['admin']],
                    ['label' => 'Subscriptions', 'href' => '/admin/subscriptions', 'roles' => ['admin']],
                    ['label' => 'Bulk SMS', 'href' => '/admin/sms/bulk', 'roles' => ['admin']],
                ],
            ],
            [
                'label' => 'System',
                'roles' => ['admin'],
                'children' => [
                    ['label' => 'Users', 'href' => '/admin/users', 'roles' => ['admin']],
                    ['label' => 'Roles', 'href' => '/admin/roles', 'roles' => ['admin']],
                    ['label' => 'Permissions', 'href' => '/admin/permissions', 'roles' => ['admin']],
                    ['label' => 'Metrics', 'href' => '/admin/metrics', 'roles' => ['admin']],
                    ['label' => 'Logs', 'href' => '/admin/logs', 'roles' => ['admin']],
                ],
            ],
            [
                'label' => 'Settings',
                'roles' => ['admin'],
                'children' => [
                    ['label' => 'General', 'href' => '/admin/settings/general', 'roles' => ['admin']],
                    ['label' => 'Theme', 'href' => '/admin/settings/theme', 'roles' => ['admin']],
                    ['label' => 'Admin Profile', 'href' => '/admin/settings/profile', 'roles' => ['admin']],
                    ['label' => 'SMTP / SMS', 'href' => '/admin/settings/integrations', 'roles' => ['admin']],
                    ['label' => 'BDApps API', 'href' => '/admin/settings/bdapps', 'roles' => ['admin']],
                    ['label' => 'USSD Menu', 'href' => '/admin/settings/ussd-menu', 'roles' => ['admin']],
                    ['label' => 'Footer Links', 'href' => '/admin/settings/footer', 'roles' => ['admin']],
                    ['label' => 'User Menu', 'href' => '/admin/settings/menu', 'roles' => ['admin']],
                    ['label' => 'Optimize', 'href' => '/admin/settings/optimize', 'roles' => ['admin']],
                ],
            ],
        ];

        $this->saveMenuItemsRecursive($adminMenu, 'admin');

        // Seed default User/Nav Menus
        $userMenu = [
            ['label' => 'News feed', 'href' => '/'],
            ['label' => 'Profile', 'href' => '/profile'],
            ['label' => 'About', 'href' => '/about'],
            ['label' => 'Help', 'href' => '/help'],
        ];

        // Seed public user menus (without truncating everything first)
        Menu::where('type', 'user')->delete();
        $this->saveMenuItemsRecursive($userMenu, 'user');

        // Assign Admin role to first user
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $firstUser = User::orderBy('id')->first();
            if ($firstUser) {
                $firstUser->assignRole($adminRole);
            }
        }

        $this->command->info('Admin and User menus seeded successfully.');
    }

    /**
     * Recursively save menu items to database.
     */
    private function saveMenuItemsRecursive(array $items, string $type, ?int $parentId = null): void
    {
        foreach ($items as $idx => $item) {
            $dbItem = Menu::create([
                'type' => $type,
                'parent_id' => $parentId,
                'label' => $item['label'] ?? '',
                'href' => $item['href'] ?? null,
                'roles' => isset($item['roles']) ? (array) $item['roles'] : null,
                'page_id' => isset($item['page_id']) ? (int) $item['page_id'] : null,
                'article_id' => isset($item['article_id']) ? (int) $item['article_id'] : null,
                'sort_order' => $idx,
            ]);

            if (isset($item['children']) && is_array($item['children'])) {
                $this->saveMenuItemsRecursive($item['children'], $type, $dbItem->id);
            }
        }
    }
}
