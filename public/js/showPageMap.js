mapboxgl.accessToken = mapToken;
let map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: campground.geometry.coordinates,
	zoom: 10,
});

new mapboxgl.Marker({ color: '#317E07' })
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			`<h5>${campground.title}</h5><p>${campground.location}</p>`
		)
	)
	.addTo(map);
