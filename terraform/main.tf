/*
The AWS user used by terraform is granted the AWS managed policy AdministratorAccess.
*/

terraform {
  backend "s3" {
    bucket         = "pocagroup"
    key            = "poca-2022"
    region         = "eu-west-3"
    dynamodb_table = "poca-tfstates-locks"
    access_key     = "AKIAZD66DWMCGQAQIPH7"
    secret_key     = "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"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "eu-west-3" # Europe (Paris)
}

data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
