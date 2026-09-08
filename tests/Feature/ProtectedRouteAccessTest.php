<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Verifies that all subscriber-protected routes correctly gate access.
 * Unauthenticated visitors must be redirected to /login.
 */
class ProtectedRouteAccessTest extends TestCase
{
    /**
     * Visiting /library without a subscriber session must redirect to /login.
     */
    public function test_library_redirects_unauthenticated_visitors_to_login(): void
    {
        $response = $this->get('/library');

        $response->assertRedirect('/login');
    }

    /**
     * Visiting /search without a subscriber session must redirect to /login.
     */
    public function test_search_redirects_unauthenticated_visitors_to_login(): void
    {
        $response = $this->get('/search');

        $response->assertRedirect('/login');
    }

    /**
     * Visiting /kid-profiles without a subscriber session must redirect to /login.
     */
    public function test_kid_profiles_redirects_unauthenticated_visitors_to_login(): void
    {
        $response = $this->get('/kid-profiles');

        $response->assertRedirect('/login');
    }

    /**
     * Visiting /kid without a subscriber session must redirect to /login.
     */
    public function test_kid_route_redirects_unauthenticated_visitors_to_login(): void
    {
        $response = $this->get('/kid');

        $response->assertRedirect('/login');
    }

    /**
     * Visiting /profile without a subscriber session must redirect to /login.
     */
    public function test_profile_redirects_unauthenticated_visitors_to_login(): void
    {
        $response = $this->get('/profile');

        $response->assertRedirect('/login');
    }
}
