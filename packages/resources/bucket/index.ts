abstract class Bucket {
  abstract getBucketName(): string;
  abstract uploadObject(object: BucketObject): void;
}

abstract class BucketObject {
  abstract getBucketObjectName(): string;
}
