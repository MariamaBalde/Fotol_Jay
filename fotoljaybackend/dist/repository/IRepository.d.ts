export interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: Omit<T, "id" | "dateCreation" | "dateMiseAJour">): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<T>;
}
//# sourceMappingURL=IRepository.d.ts.map