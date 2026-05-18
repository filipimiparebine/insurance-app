resource "aws_s3_bucket" "documents" {
  bucket = "${var.bucket_prefix}-documents"
}

resource "aws_s3_bucket_versioning" "documents_versioning" {
  bucket = aws_s3_bucket.documents.id

  versioning_configuration {
    status = "Enabled"
  }
}


resource "aws_s3_bucket_public_access_block" "documents_access" {
  bucket = aws_s3_bucket.documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


resource "aws_s3_bucket" "backups" {
  bucket = "${var.bucket_prefix}-backups"
}

resource "aws_s3_bucket_versioning" "backups_versioning" {
  bucket = aws_s3_bucket.backups.id

  versioning_configuration {
    status = var.backup_versioning_enabled ? "Enabled" : "Suspended"
  }
}


resource "aws_s3_bucket_public_access_block" "backups_access" {
  bucket = aws_s3_bucket.backups.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


resource "aws_s3_bucket" "static_assets" {
  bucket = "${var.bucket_prefix}-static"
}


resource "aws_s3_bucket_cors_configuration" "static_cors" {
  bucket = aws_s3_bucket.static_assets.id

  cors_rule {
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = var.cors_allowed_origins
    allowed_headers = ["*"]
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_public_access_block" "static_access" {
  bucket = aws_s3_bucket.static_assets.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# resource "aws_s3_bucket_policy" "static_public_read" {
#   bucket = aws_s3_bucket.static_assets.id
#
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid       = "PublicReadGetObject"
#         Effect    = "Allow"
#         Principal = "*"
#         Action    = ["s3:GetObject"]
#         Resource  = ["${aws_s3_bucket.static_assets.arn}/*"]
#       }
#     ]
#   })
# }
