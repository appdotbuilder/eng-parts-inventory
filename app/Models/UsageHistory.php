<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\UsageHistory
 *
 * @property int $id
 * @property int $spare_part_id
 * @property int $user_id
 * @property int $quantity_used
 * @property int $quantity_before
 * @property int $quantity_after
 * @property string|null $purpose
 * @property string|null $work_order
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\SparePart $sparePart
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory wherePurpose($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereQuantityAfter($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereQuantityBefore($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereQuantityUsed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereSparePartId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsageHistory whereWorkOrder($value)
 * @method static \Database\Factories\UsageHistoryFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class UsageHistory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'spare_part_id',
        'user_id',
        'quantity_used',
        'quantity_before',
        'quantity_after',
        'purpose',
        'work_order',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'spare_part_id' => 'integer',
        'user_id' => 'integer',
        'quantity_used' => 'integer',
        'quantity_before' => 'integer',
        'quantity_after' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the spare part that this usage history belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function sparePart(): BelongsTo
    {
        return $this->belongsTo(SparePart::class);
    }

    /**
     * Get the user that recorded this usage.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}