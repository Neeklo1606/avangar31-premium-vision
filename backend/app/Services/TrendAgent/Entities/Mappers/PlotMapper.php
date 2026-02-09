<?php

namespace App\Services\TrendAgent\Entities\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\AbstractEntity;
use App\Services\TrendAgent\Entities\PlotEntity;

class PlotMapper extends AbstractMapper
{
    public function __construct()
    {
        parent::__construct(ObjectType::PLOTS);
    }

    public function map(array $data): AbstractEntity
    {
        $this->validate($data);
        return PlotEntity::fromArray($data);
    }
}
