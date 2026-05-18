output "documents_bucket_name" {
  description = "Name of the documents S3 bucket"
  value       = aws_s3_bucket.documents.bucket
}

output "documents_bucket_arn" {
  description = "ARN of the documents S3 bucket"
  value       = aws_s3_bucket.documents.arn
}

output "documents_bucket_endpoint" {
  description = "S3 endpoint URL for the documents bucket"
  value       = "${var.endpoint_url}/${aws_s3_bucket.documents.bucket}"
}

output "backups_bucket_name" {
  description = "Name of the backups S3 bucket"
  value       = aws_s3_bucket.backups.bucket
}

output "backups_bucket_arn" {
  description = "ARN of the backups S3 bucket"
  value       = aws_s3_bucket.backups.arn
}

output "backups_bucket_endpoint" {
  description = "S3 endpoint URL for the backups bucket"
  value       = "${var.endpoint_url}/${aws_s3_bucket.backups.bucket}"
}

output "static_bucket_name" {
  description = "Name of the static assets S3 bucket"
  value       = aws_s3_bucket.static_assets.bucket
}

output "static_bucket_arn" {
  description = "ARN of the static assets S3 bucket"
  value       = aws_s3_bucket.static_assets.arn
}

output "static_bucket_endpoint" {
  description = "S3 endpoint URL for the static assets bucket"
  value       = "${var.endpoint_url}/${aws_s3_bucket.static_assets.bucket}"
}

output "s3_region" {
  description = "S3 region (EU compliance evidence)"
  value       = var.region
}

output "s3_endpoint" {
  description = "Hetzner S3 endpoint"
  value       = var.endpoint_url
}
