<?php

namespace App\Services\TrendAgent\Entities\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\AbstractEntity;
use App\Services\TrendAgent\Entities\HouseProjectEntity;

class HouseProjectMapper extends AbstractMapper
{
    public function __construct()
    {
        parent::__construct(ObjectType::HOUSE_PROJECTS);
    }

    public function map(array $data): AbstractEntity
    {
        $this->validate($data);
        return HouseProjectEntity::fromArray($data);
    }
}
