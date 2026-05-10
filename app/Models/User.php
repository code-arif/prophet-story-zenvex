<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * User Model - Represents authenticated users in the system
 * 
 * This model handles user authentication, authorization, and role-based access control.
 * Users can be assigned multiple roles, and each role can have multiple permissions.
 * The model also supports admin users with special privileges.
 * 
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $phone
 * @property string $password
 * @property bool $is_admin
 * @property string $remember_token
 * @property \Illuminate\Support\Carbon $email_verified_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property \Illuminate\Database\Eloquent\Collection|Role[] $roles
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     * 
     * These fields can be bulk-assigned using methods like create() or fill().
     * Only include fields that are safe for mass assignment.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',          // User's full name
        'email',         // User's email address (unique)
        'phone',         // User's phone number (optional)
        'password',      // Hashed password
        'is_admin',      // Flag indicating if user has admin privileges
    ];

    /**
     * The attributes that should be hidden for serialization.
     * 
     * These fields will be excluded when the model is converted to arrays/JSON.
     * This prevents sensitive data like passwords from being exposed in API responses.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',         // Hashed password - never expose in API responses
        'remember_token',    // Remember token for "remember me" functionality
    ];
    /*
     * Defines how attributes should be converted when accessing or setting them.
     * - datetime: Automatically cast to/from Carbon instances
     * - hashed: Automatically hash values when setting (for passwords)
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',  // Cast to Carbon instance
            'password' => 'hashed',             // Automatically hash passwords
        ];
    }

    /**
     * Get the roles assigned to this user.
     * 
     * Defines a many-to-many relationship between User and Role models.
     * Uses the 'role_user' pivot table to manage the relationship.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    /**
     * Check if user has a specific role or any of multiple roles.
     * 
     * This method supports both single role checking and multiple role checking.
     * Useful for authorization checks throughout the application.
     * 
     * @param string|array $roles Single role name or array of role names
     * @return bool True if user has the role(s), false otherwise
     */
    public function hasRole(string|array $roles): bool
    {
        if (is_string($roles)) {
            return $this->roles()->where('name', $roles)->exists();
        }

        return $this->roles()->whereIn('name', $roles)->exists();
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        return $this->roles()->whereHas('permissions', function ($query) use ($permission) {
            $query->where('name', $permission);
        })->exists();
    }

    /**
     * Get all permissions for this user through their roles.
     * 
     * Collects all unique permissions from all roles assigned to the user.
     * Returns an associative array with permission name as key and display name as value.
     * 
     * @return array Associative array of permissions ['permission_name' => 'display_name']
     */
    public function getAllPermissions(): array
    {
        $permissions = [];
        
        foreach ($this->roles as $role) {
            foreach ($role->permissions as $permission) {
                $permissions[$permission->name] = $permission->display_name;
            }
        }

        return $permissions;
    }

    /**
     * Check if user is admin.
     * 
     * Determines if the user has admin privileges using two methods:
     * 1. Legacy check: Looks at the `is_admin` flag on the user record
     * 2. Role-based check: Checks if user has any admin-type roles
     * 
     * This provides backwards compatibility while supporting the new role-based system.
     * 
     * @return bool True if user is an admin, false otherwise
     */
    public function isAdmin(): bool
    {
        // Backwards compatible: respect legacy `is_admin` flag.
        if (!empty($this->is_admin)) {
            return true;
        }

        // Allow any admin-type role to be considered as admin access.
        return $this->hasRole(['admin', 'moderator', 'editor']);
    }
}
