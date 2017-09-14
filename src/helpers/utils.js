import multer from 'multer';
import AWS from 'aws-sdk';
import config from '../config/env';

const { s3: s3Credentials } = config.aws;
export const paginate = {
  limit(limit, value) {
    return limit !== undefined ? limit : value || 20;
  },
  offset(offset, value) {
    return offset !== undefined ? offset : value || 1;
  },
};

export function removeSpaces(string) {
  const noSpaces = string.replace(/\s+/g, '').trim();
  return noSpaces.substring(1, noSpaces.length - 1);
}

export function upload() {
  return multer().single('file');
}

AWS.config.update({
  accessKeyId: s3Credentials.accessKeyId,
  secretAccessKey: s3Credentials.secretAccessKey,
  region: s3Credentials.region,
});

export const s3 = new AWS.S3();

export function average(items, n) {
  return items.reduce((acum, act) => acum + act) / n;
}
