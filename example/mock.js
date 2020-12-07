/**
 * fetch Mock数据
 * @returns {*}
 */
function getMockList() {
  return fetch('http://localhost:3000/routerMap').then(res => res.json()).catch(e => {
    console.warn(e);
  });
}

/**
 * 返回过滤后的URl
 * @param newUrl
 * @returns {string}
 */
function isMock(newUrl = '') {
  const mockList = JSON.parse(sessionStorage.getItem('mockList'));
  if (Array.isArray(mockList) && mockList.some(e => newUrl.includes(e))) {
    return newUrl.replace(`${process.env.BASE_URI}`, 'http://localhost:3000/api/api');
  }
  return newUrl;
}

/**
 *  检查mockList
 * @param newUrl
 * @returns {string|string}
 */
 export const checkMockList = (newUrl) => {
  if (!sessionStorage.getItem('mockList')) {
    getMockList().then(res => {
      const mockList = res || [];
      sessionStorage.setItem('mockList', JSON.stringify(mockList));
    });
  }
  return isMock(newUrl);
};
