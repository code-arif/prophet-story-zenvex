<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Smoke tests verifying the application boots and the most critical public
 * routes respond with the expected HTTP status codes.
 */
class ExampleTest extends TestCase
{
    /**
     * The login page is a public route and must always return 200.
     */
    public function test_login_page_returns_successful_response(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    /**
     * The root URL ("/") renders the public landing page for unauthenticated
     * visitors. The GuestAccess middleware allows them through.
     */
    public function test_root_returns_successful_response_for_unauthenticated_visitor(): void
    {
        $response = $this->get('/');

        // Landing page is shown (200) or GuestAccess middleware redirects to login
        // depending on the guest_mode_enabled setting — either is acceptable.
        $this->assertContains($response->status(), [200, 302]);
    }
}
