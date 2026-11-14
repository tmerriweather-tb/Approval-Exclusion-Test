// Read artwork from the existing trusted Terraboost Azure image host for browser OCR.
const https = require('https');
const MAX_BYTES = 12 * 1024 * 1024;
exports.handler = async event => {
 if (event.httpMethod !== 'GET') return {statusCode:405,body:'Method not allowed'};
 let url;
 try {url=new URL(event.queryStringParameters?.url||'');} catch (_) {return fail(400,'Invalid artwork URL');}
 if (url.protocol !== 'https:' || !['stterraboostv3dev.blob.core.windows.net','qaterraboostpublicassets.blob.core.windows.net'].includes(url.hostname) || !url.pathname.startsWith('/storage/')) return fail(403,'Artwork URL host not supported');
 if (!/\.(png|jpe?g|webp|gif|bmp)(?:$)/i.test(url.pathname)) return fail(415,'Unsupported image type');
 try {
  const result=await new Promise((resolve,reject)=>{
   const req=https.get(url,{timeout:16000},res=>{
    if(res.statusCode!==200){res.resume();reject(new Error('Image server returned HTTP '+res.statusCode));return}
    const contentType=(res.headers['content-type']||'').split(';')[0].toLowerCase();
    if(!contentType.startsWith('image/')){res.resume();reject(new Error('Artwork is not an image'));return}
    let size=0;const chunks=[];
    res.on('data',chunk=>{size+=chunk.length;if(size>MAX_BYTES){req.destroy(new Error('Image exceeds 12 MB'));return}chunks.push(chunk)});
    res.on('end',()=>resolve({body:Buffer.concat(chunks).toString('base64'),contentType}));
    res.on('error',reject);
   });req.on('timeout',()=>req.destroy(new Error('Image request timed out')));req.on('error',reject);
  });
  return {statusCode:200,isBase64Encoded:true,headers:{'Content-Type':result.contentType,'Cache-Control':'public, max-age=3600','Access-Control-Allow-Origin':'*'},body:result.body};
 }catch(err){return fail(502,'Unable to retrieve artwork: '+err.message)}
};
function fail(statusCode,error){return {statusCode,headers:{'Content-Type':'application/json'},body:JSON.stringify({error})}}
