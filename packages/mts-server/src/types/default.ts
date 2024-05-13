type GetObjDifferentKeys<T, U> = Omit<T, keyof U> & Omit<U, keyof T>
type GetObjSameKeys<T, U> = Omit<T | U, keyof GetObjDifferentKeys<T, U>>