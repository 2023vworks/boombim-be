
for arg in "$@"; do
    if [[ "$arg" == *"/"* ]]; then
        echo "인자에 '/'가 포함되어 있습니다. 스크립트를 종료합니다."
        exit 1
    fi
done

nest g mo $1
nest g co $1
nest g s $1
cd $1

nest g cl $1.repository
mv geo-mark.repository/* ./
rm -rf geo-mark.repository

mkdir document
touch document/index.ts
touch document/document.decorator.ts

mkdir domain
touch domain/index.ts
touch domain/$1.domain.ts

mkdir domain/dto
touch domain/dto/index.ts

mkdir domain/dto/request
mkdir domain/dto/response
touch domain/dto/request/index.ts
touch domain/dto/response/index.ts
