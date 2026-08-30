<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceProviderProfileRequest extends FormRequest
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
            'category_ids' => ['sometimes', 'required', 'array', 'min:1'],
            'category_ids.*' => ['exists:service_categories,id'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'visit_charge' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'pricing_note' => ['nullable', 'string', 'max:1000'],
            'service_radius_km' => ['nullable', 'numeric', 'min:0.5', 'max:100'],
            'base_area_name' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_available_now' => ['nullable', 'boolean'],
            'document' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }
}
