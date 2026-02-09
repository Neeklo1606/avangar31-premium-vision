<?php

namespace App\Services\TrendAgent\Entities\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\AbstractEntity;
use App\Services\TrendAgent\Entities\ApartmentEntity;

class ApartmentMapper extends AbstractMapper
{
    public function __construct()
    {
        parent::__construct(ObjectType::APARTMENTS);
    }

    public function map(array $data): AbstractEntity
    {
        $this->validate($data);
        return ApartmentEntity::fromArray($data);
    }
}
