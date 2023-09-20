import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';

/**
 * typeorm key 명명규칙 변경에 사용되는 Strategy class
 */
export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  /**
   * PK 제약조건 네이밍
   * - 접두사 : "PK-"
   * - 네이밍 규칙: "PK-" + "테이블명" + "snake case를 적용한 컬럼명"
   * @param tableOrName 대상 테이블
   * @param columnNames pk 대상 컬럼의 이름 리스트
   * @returns
   * ex) PK-product-id
   */
  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const tableName = super.getTableName(tableOrName);
    const columnsSnakeCase = columnNames.join('-');
    return `PK-${tableName}-${columnsSnakeCase}`;
  }

  /**
   * FK명 네이밍 전략
   * - 접두사 : "FK-"
   * - 네이밍 규칙: 'FK-${부모_테이블명}-${자식_테이블명}'
   * @param tableOrName 자식_테이블
   * @param columnNames 자식_테이블_FK_컬럼명 배열
   * @param referencedTablePath 부모_테이블명
   * @param referencedColumnNames 부모_테이블명_PK_컬럼명 배열
   * @returns
   * FK-main_category-base_product
   */
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    referencedColumnNames?: string[],
  ) {
    const tableName = this.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    // FK-${부모_테이블명}-${자식_테이블명}
    return `FK-${referencedTablePath}-${replacedTableName}`;
  }

  /**
   * FK전용 UNIQUE 제약조건 네이밍 전략
   * - 접두사 : "PK-"
   * - 네이밍 규칙: 'REL-${테이블명}-${컬럼명1}-${컬럼명2}...'
   * @param tableOrName 대상 테이블
   * @param columnNames 대상 컬럼의 이름 리스트
   * @param where
   * @returns
   * ex) REL-base_product-deliveryId
   */
  relationConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    where?: string,
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = super.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    // let key = `${replacedTableName}_${clonedColumnNames.join('-')}`;
    // if (where) key += `_${where}`;

    // REL-${테이블명}-${컬럼명1}-${컬럼명2}...
    return `REL-${replacedTableName}-${clonedColumnNames.join('-')}`;
  }

  /**
   * UNIQUE 제약조건 네이밍 전략
   * - 접두사: "UQ-"
   * - 네이밍 전략: UQ-${테이블명}-${컬럼명1}-${컬럼명2}...
   * @param tableOrName 대상 테이블
   * @param columnNames 대상 컬럼의 이름 리스트
   * @returns
   * ex) UQ-product-productCode
   */
  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = super.getTableName(tableOrName);
    const replacedTableName = tableName.replace('.', '_');
    // UQ-${테이블명}-${컬럼명1}-${컬럼명2}...
    return `UQ-${replacedTableName}-${clonedColumnNames.join('-')}`;
  }

  /**
   * 인덱스명 전략
   * - 점두사: 'UIX-'
   * - 네이밍 전략: UIX-${테이블명}-${컬럼명1}-${컬럼명2}...
   * @param tableOrName 테이블명
   * @param columnNames 인덱스로 지정된 컬럼명 배열
   * @param wheres
   * @returns
   * ex) UIX-product-name-option
   */
  indexName(
    tableOrName: Table | string,
    columnNames: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    where?: string,
  ) {
    // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    const clonedColumnNames = [...columnNames];
    clonedColumnNames.sort();
    const tableName = super.getTableName(tableOrName);
    // UIX-${테이블명}-${컬럼명1}-${컬럼명2}...
    return `UIX-${tableName}-${clonedColumnNames.join('-')}`;
  }
}
