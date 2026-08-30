<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:service_categories,id'],
            'provider_id' => ['nullable', 'exists:service_provider_profiles,id'],
            'request_mode' => ['required', 'in:direct,broadcast'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'urgency' => ['required', 'in:scheduled,urgent_today,emergency_now'],
            'preferred_date' => ['nullable', 'required_if:urgency,scheduled', 'date', 'after_or_equal:today'],
            'preferred_time_slot' => ['nullable', 'string', 'max:100'],
            'address_note' => ['required', 'string', 'max:1000'],
            'district' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => ['file', 'mimes:jpg,jpeg,png,webp', 'max:5120'], // Max 5MB per photo
        ];
    }
}
