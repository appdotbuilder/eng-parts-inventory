<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSparePartRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:spare_parts,code',
            'quantity' => 'required|integer|min:0',
            'min_quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'supplier' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Spare part name is required.',
            'code.required' => 'Part code is required.',
            'code.unique' => 'This part code already exists.',
            'quantity.required' => 'Current quantity is required.',
            'quantity.min' => 'Quantity cannot be negative.',
            'min_quantity.required' => 'Minimum quantity is required.',
            'min_quantity.min' => 'Minimum quantity must be at least 1.',
            'price.required' => 'Price is required.',
            'price.min' => 'Price cannot be negative.',
        ];
    }
}