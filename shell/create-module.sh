#!/bin/sh

# 실행된 스크립트 파일의 디렉토리 추출
script_dir="$(cd "$(dirname "$0")" && pwd)"
# util 스크립트 로드
source $script_dir/util.sh 

# 인자 개수 체크
check_argument "$@"
# 도움말 표시
display_help "$1"
# 슬래시 확인
check_slash_in_argument "$@"

## 1. nest cli를 사용한 실행문 ##
nest g mo $1 --no-spec
nest g co $1 --no-spec
nest g s $1 --no-spec
cd $1

nest g cl $1.repository --no-spec
mv $1.repository/* ./
rm -r $1.repository

## 2. make document dir
mkdir document
touch document/index.ts
## document/document.decorator.ts 생성
controller_class=$(to_upper_camel "$1")Controller
controller_elements=(
  "import { $controller_class } from '../$1.controller';"
  ""
  "type API_DOC_TYPE = keyof $controller_class;"
  ""
  "// eslint-disable-next-line @typescript-eslint/ban-types"
  "const decorators: Record<API_DOC_TYPE, Function> = {};"
  ""
  "export const DocumentHelper = (docType: API_DOC_TYPE) => {"
  "  return decorators[docType]();"
  "};"
)
for element in "${controller_elements[@]}"; do
    echo "$element"
done > document/document.decorator.ts


## 3. make domain dir
mkdir domain
touch domain/index.ts
domain_class=$(to_upper_camel "$1")
domain_elements=(
  "import { ${domain_class}Entity } from '@app/entity';"
  "import { BaseDomain } from 'src/domain/base.domain';"
  ""
  "export interface ${domain_class}Props extends ${domain_class}Entity {}"
  ""
  "export class $domain_class extends BaseDomain<${domain_class}Props> {"
  "  constructor(readonly props: ${domain_class}Props) {"
  "    super(props);"
  "  }"
  "}"
)
for element in "${domain_elements[@]}"; do
    echo "$element"
done > domain/$1.domain.ts


## 4. make dto dir
mkdir dto
touch dto/index.ts

mkdir dto/request
mkdir dto/response
touch dto/request/index.ts
touch dto/response/index.ts
