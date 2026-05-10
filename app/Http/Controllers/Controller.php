<?php

namespace App\Http\Controllers;

/**
 * Base Controller
 * 
 * This is the base controller class that all other controllers extend.
 * It provides common functionality and can be used to define middleware,
 * authorize requests, or add shared methods for all controllers.
 * 
 * Laravel's base Controller class provides methods like:
 * - middleware() - Attach middleware to controller actions
 * - authorize() - Check authorization policies
 * - validate() - Validate incoming requests
 */
abstract class Controller
{
    //
}
