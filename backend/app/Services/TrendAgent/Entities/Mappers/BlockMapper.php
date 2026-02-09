<?php

namespace App\Services\TrendAgent\Entities\Mappers;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\AbstractEntity;
use App\Services\TrendAgent\Entities\BlockEntity;

/**
 * Mapper для BlockEntity (ЖК)
 */
class BlockMapper extends AbstractMapper
{
    public function __construct()
    {
        parent::__construct(ObjectType::BLOCKS);
    }

    /**
     * Преобразовать данные в BlockEntity
     */
    public function map(array $data): AbstractEntity
    {
        $this->validate($data);
        
        return BlockEntity::fromArray($data);
    }
}
