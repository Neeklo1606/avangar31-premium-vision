<?php

namespace App\Services\TrendAgent\Detail\Strategies;

use App\Services\TrendAgent\Core\ObjectType;

/**
 * Интерфейс стратегии агрегации детальных данных
 * 
 * Каждый тип объекта может иметь свою стратегию
 * для получения всех необходимых данных
 */
interface DetailStrategy
{
    /**
     * Получить список endpoint'ов для агрегации
     * 
     * @param string $id ID объекта
     * @param string $city ID города
     * @return array<string, string> [key => url]
     */
    public function getEndpoints(string $id, string $city): array;

    /**
     * Агрегировать ответы в финальную структуру
     * 
     * @param array $responses Ответы от endpoint'ов
     * @return array Агрегированные данные
     */
    public function aggregate(array $responses): array;

    /**
     * Получить тип объекта для стратегии
     */
    public function getObjectType(): ObjectType;
}
