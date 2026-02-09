<?php

namespace App\Services\TrendAgent\Entities\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\AbstractEntity;
use App\Services\TrendAgent\Entities\ParkingEntity;

class ParkingMapper extends AbstractMapper
{
    public function __construct()
    {
        parent::__construct(ObjectType::PARKING);
    }

    public function map(array $data): AbstractEntity
    {
        $this->validate($data);
        return ParkingEntity::fromArray($data);
    }
}
