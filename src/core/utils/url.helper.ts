export class UrlHelper {

  getResourceId(url, resrc): number {
    const urls = url.split('/');
    return parseInt(urls[urls.indexOf(resrc) + 1]);
  }

}