<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * ProphetRequest - Validates Prophet create/update submissions.
 *
 * Used by both store and update in AdminProphetController. `name_arabic` is
 * the only optional field; `cover_image_path` is required so every Prophet
 * library card has a cover.
 */
class ProphetRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:120'],
            'name_arabic' => ['nullable', 'string', 'max:120'],
            'short_intro' => ['required', 'string'],
            'cover_image_path' => ['required', 'string', 'max:500'],
            'chronological_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cover_image_path.required' => 'A cover image path is required.',
            'chronological_order.required' => 'Chronological order is required for library sequencing.',
        ];
    }
}