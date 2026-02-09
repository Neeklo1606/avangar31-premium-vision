<?php

namespace App\Services\TrendAgent\Entities;

use App\Services\TrendAgent\Core\ObjectType;
use App\Services\TrendAgent\Entities\Mappers\{
    BlockMapper,
    ApartmentMapper,
    ParkingMapper,
    HouseMapper,
    PlotMapper,
    CommerceMapper,
    HouseProjectMapper,
    VillageMapper
};

/**
 * Нормализатор для преобразования raw API data → Entity
 * 
 * Центральная точка для создания Entity из API ответов
 */
class EntityNormalizer
{
    private EntityFactory $factory;

    public function __construct(?EntityFactory $factory = null)
    {
        $this->factory = $factory ?? $this->createDefaultFactory();
    }

    /**
     * Нормализовать данные в Entity
     * 
     * @throws \InvalidArgumentException если данные невалидны или Mapper не найден
     */
    public function normalize(ObjectType $objectType, array $data): AbstractEntity
    {
        return $this->factory->create($objectType, $data);
    }

    /**
     * Нормализовать массив данных в массив Entity
     * 
     * @return AbstractEntity[]
     */
    public function normalizeMany(ObjectType $objectType, array $items): array
    {
        return $this->factory->createMany($objectType, $items);
    }

    /**
     * Получить фабрику
     */
    public function getFactory(): EntityFactory
    {
        return $this->factory;
    }

    /**
     * Создать фабрику с дефолтными Mapper'ами
     */
    private function createDefaultFactory(): EntityFactory
    {
        $factory = new EntityFactory();

        // Регистрация всех Mapper'ов
        $factory->registerMappers([
            new BlockMapper(),
            new ApartmentMapper(),
            new ParkingMapper(),
            new HouseMapper(),
            new PlotMapper(),
            new CommerceMapper(),
            new HouseProjectMapper(),
            new VillageMapper(),
        ]);

        return $factory;
    }
}
