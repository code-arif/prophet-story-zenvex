<?php

namespace Tests\Feature;

use Tests\TestCase;

class WorkScopeRouteTest extends TestCase
{
    public function test_work_scope_route_exists_for_authenticated_or_guest_redirect_flow(): void
    {
        $response = $this->get('/work/scope');

        $response->assertRedirect('/login');
    }
}
