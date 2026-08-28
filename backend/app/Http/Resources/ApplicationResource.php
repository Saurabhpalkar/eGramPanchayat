<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'application_no' => $this->application_no,
            'user_id' => $this->user_id,
            'service_id' => $this->service_id,
            'status' => $this->status,
            'applied_date' => $this->applied_date,
            'due_date' => $this->due_date,
            'approved_date' => $this->approved_date,
            'remarks' => $this->remarks,
            'service' => $this->whenLoaded('service'),
            'user' => $this->whenLoaded('user'),

        ];
    }
}
