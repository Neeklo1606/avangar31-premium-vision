<?php

namespace App\Services\TrendAgent\Entities\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\AbstractEntity;
use App\Services\TrendAgent\Entities\HouseEntity;

class HouseMapper extends AbstractMapper
{
    public function __construct()
    {
        parent::__construct(ObjectType::HOUSES);
    }

    public function map(array $data): AbstractEntity
    {
        $this->validate($data);
        return HouseEntity::fromArray($data);
    }
}
