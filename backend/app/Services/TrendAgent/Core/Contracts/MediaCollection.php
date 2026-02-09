<?php

namespace App\Services\TrendAgent\Core\Contracts;

/**
 * Коллекция медиа-контента объекта
 * 
 * Хранит и группирует все типы медиа:
 * - Фото (планы, ход строительства, отделка, и т.д.)
 * - Видео
 * - Документы
 * - 3D-туры
 * - Поэтажные планы
 */
class MediaCollection
{
    public function __construct(
        public readonly array $photos = [],
        public readonly array $videos = [],
        public readonly array $documents = [],
        public readonly array $tours3D = [],
        public readonly array $floorPlans = [],
        public readonly array $other = []
    ) {}

    /**
     * Проверить, есть ли хотя бы один медиа-элемент
     */
    public function isEmpty(): bool
    {
        return empty($this->photos)
            && empty($this->videos)
            && empty($this->documents)
            && empty($this->tours3D)
            && empty($this->floorPlans)
            && empty($this->other);
    }

    /**
     * Получить общее количество медиа
     */
    public function getTotalCount(): int
    {
        return count($this->photos)
            + count($this->videos)
            + count($this->documents)
            + count($this->tours3D)
            + count($this->floorPlans)
            + count($this->other);
    }

    /**
     * Проверить, есть ли фото
     */
    public function hasPhotos(): bool
    {
        return !empty($this->photos);
    }

    /**
     * Проверить, есть ли видео
     */
    public function hasVideos(): bool
    {
        return !empty($this->videos);
    }

    /**
     * Проверить, есть ли документы
     */
    public function hasDocuments(): bool
    {
        return !empty($this->documents);
    }

    /**
     * Проверить, есть ли 3D-туры
     */
    public function has3DTours(): bool
    {
        return !empty($this->tours3D);
    }

    /**
     * Преобразовать в массив
     */
    public function toArray(): array
    {
        return [
            'photos' => $this->photos,
            'videos' => $this->videos,
            'documents' => $this->documents,
            'tours3D' => $this->tours3D,
            'floorPlans' => $this->floorPlans,
            'other' => $this->other,
            'totalCount' => $this->getTotalCount(),
        ];
    }
}
