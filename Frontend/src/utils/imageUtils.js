export const getImageForPlace = (placeName) => {
    switch (placeName) {
      case '서울':
        return 'https://cdn.pixabay.com/photo/2022/09/16/17/07/city-7459162_1280.jpg';
      case '대전':
        return 'https://i.namu.wiki/i/8FyieVzq1ufJT_AXLuFqQYYhke0_k64dTMiXI-RTNai2PHpGNKvLgejhH_XFuCfUJUtaJQ52WfZvzbfMKxDrxmjukgtUeeOdVWJc8ttnKwwBvKZFFo0VfhYF1sXmV9UxWitQfqDMp3zKUUGtgm5DIQ.webp';
      case '부산':
        return 'https://i.namu.wiki/i/2C6UPE7J66hX_e0f0xqKutGZu_LHKHLRfMqNGJbFM-8udxFmnGfF17bSXH8yBl9vF3f8ctje-T-qMQlikRdd46U-ZPP-t2m-oDV7X_igv1QEZg3bzJ2cJ0E9u6rnHK50tbT8b-lfPBCP65UVZ2DRRQ.webp';
      case '인천':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Incheon_Station_20230430_013.jpg/300px-Incheon_Station_20230430_013.jpg';
      case '도쿄':
        return 'https://i.namu.wiki/i/ultfBOlLmDn7xGH8qpy2gGUkRA6kXuzqwqFHUSPnxk61suj0LFMymgrss9EnCtzEeywrhGJhZTn09iPx5FkW8IedMBcX71P4z1snHvW6i-0deXFZY8liOBji2EjRuS_3e8l3wSJ0aIlQUqwAgUPhKw.webp';
      case '후쿠오카':
        return 'https://thumb.tidesquare.com/common_cdn/upload/image/place/tmp/12273_2.jpg';
      case 'LA':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/LA_Skyline_Mountains2.jpg/1024px-LA_Skyline_Mountains2.jpg';
      case '로마':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1200px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg';
      case '파리':
        return 'https://asset-prod.france.fr/Eiffel_Tower_at_sunset_in_Paris_France_Romantic_travel_background_Man79_Adobe_Stock_8aa81830ce.jpeg';
      case '제주도':
        return 'https://cdn.pixabay.com/photo/2022/04/28/19/47/republic-of-korea-7161860_1280.jpg';
      default:
        return 'https://mblogthumb-phinf.pstatic.net/MjAxODAzMDNfMjQ0/MDAxNTIwMDQxOTUyNTE2.f2kZuCUOL8q5Kqzd5JmqKFmjudM4qAYfJ2I_Q6ekvA4g.otiUZ4LFf7kVDb8PLN-1XImiREBhg3dXOL7kJ5UpQ7Yg.PNG.osy2201/6_%2880%ED%8D%BC%EC%84%BC%ED%8A%B8_%ED%9A%8C%EC%83%89%29_%ED%9A%8C%EC%83%89_%EB%8B%A8%EC%83%89_%EB%B0%B0%EA%B2%BD%ED%99%94%EB%A9%B4_180303.png?type=w800';
    }
  };