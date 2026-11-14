const https = require('https');
const MAX_BYTES = 12 * 1024 * 1024;
const HOSTS = new Set(['stterraboostv3dev.blob.core.windows.net','qaterraboostpublicassets.blob.core.windows.net']);
function validate(value){
 const url=new URL(value);
 if(url.protocol!=='https:'||!HOSTS.has(url.hostname)||!url.pathname.startsWith('/storage/'))throw new Error('Artwork URL host not supported');
 return url;
}
function sniff(buf){
 if(buf.length>=8 && buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'image/png';
 if(buf.length>=3 && buf.subarray(0,3).equals(Buffer.from([255,216,255])))return 'image/jpeg';
 if(buf.subarray(0,6).toString()==='GIF87a'||buf.subarray(0,6).toString()==='GIF89a')return 'image/gif';
 if(buf.subarray(0,4).toString()==='RIFF'&&buf.subarray(8,12).toString()==='WEBP')return 'image/webp';
 if(buf.subarray(0,2).toString()==='BM')return 'image/bmp';
 return null;
}
function getImage(url,redirects=0){return new Promise((resolve,reject)=>{
 const req=https.get(url,{timeout:16000,headers:{'Accept':'image/avif,image/webp,image/png,image/jpeg,image/gif,image/*;q=0.8,*/*;q=0.2','User-Agent':'Mozilla/5.0 (compatible; VenueArtworkScanner/1.0)'}},res=>{
  if([301,302,303,307,308].includes(res.statusCode)&&res.headers.location){
   res.resume();if(redirects>=3)return reject(new Error('Too many artwork redirects'));
   try{resolve(getImage(validate(new URL(res.headers.location,url).href),redirects+1))}catch(e){reject(e)}return;
  }
  if(res.statusCode!==200){res.resume();return reject(new Error('Artwork host returned HTTP '+res.statusCode))}
  let size=0;const chunks=[];
  res.on('data',chunk=>{size+=chunk.length;if(size>MAX_BYTES){req.destroy(new Error('Image exceeds 12 MB'));return}chunks.push(chunk)});
  res.on('end',()=>{
   const data=Buffer.concat(chunks);const type=sniff(data);
   if(!type){const contentType=String(res.headers['content-type']||'unknown');return reject(new Error('Artwork URL returned '+contentType+' instead of image bytes. Check that the card FileUrl points directly to a public PNG/JPG image.'))}
   resolve({data,type});
  });res.on('error',reject);
 });req.on('timeout',()=>req.destroy(new Error('Image request timed out')));req.on('error',reject);
})}
exports.handler=async event=>{
 if(event.httpMethod!=='GET')return {statusCode:405,body:'Method not allowed'};
 let url;try{url=validate(event.queryStringParameters?.url||'')}catch(e){return fail(400,e.message)}
 try{const {data,type}=await getImage(url);return {statusCode:200,isBase64Encoded:true,headers:{'Content-Type':type,'Cache-Control':'public, max-age=3600','Access-Control-Allow-Origin':'*'},body:data.toString('base64')}}
 catch(e){return fail(502,'Unable to retrieve artwork: '+e.message)}
};
function fail(statusCode,error){return {statusCode,headers:{'Content-Type':'application/json'},body:JSON.stringify({error})}}
