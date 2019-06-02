function findDriver(departure, arrival, date, callback) {

    var query = `departure=${departure}&arrival=${arrival}`;

    if (date) {
        query += `&date=${date.toISOString()}`;
    }

    $.ajax({
        method: "GET",
        url: `https://roadtrip.esinx.net/api/ride?${query}`,
    }).done(function (response) {
        console.log(response);
        callback(response);
    }).catch(function (error) {
        callback(error);
    });

}

function join(authkey, rideID, callback) {
    $.ajax({
        method: "POST",
        url: `https://roadtrip.esinx.net/api/rides/${rideID}/join`,
        data: {
            'authkey': authkey
        }
    }).done(function (response) {
        callback(response);
    }).catch(function (error) {
        callback(error);
    });
}