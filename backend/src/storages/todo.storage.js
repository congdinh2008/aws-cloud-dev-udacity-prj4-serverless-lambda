class TodoStorage {
  constructor(s3Client, s3BucketName, urlExpiration) {
    this.s3Client = s3Client;
    this.s3BucketName = s3BucketName;
    this.urlExpiration = urlExpiration;
  }

  async getAttachmentUrl(attachmentId) {
    const attachmentUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${attachmentId}`;
    return attachmentUrl;
  }

  async getUploadUrl(attachmentId) {
    const uploadUrl = this.s3Client.getSignedUrl("putObject", {
      Bucket: this.s3BucketName,
      Key: attachmentId,
      Expires: this.urlExpiration,
    });
    return uploadUrl;
  }
}

export default TodoStorage;
