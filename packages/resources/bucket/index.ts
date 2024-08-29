interface Bucket {
  getBucketName(): string;
  uploadObject(object: BucketObject): void;
}

interface BucketObject {
  getBucketObjectName(): string;
}
