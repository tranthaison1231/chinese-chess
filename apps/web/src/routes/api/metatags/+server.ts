import { json } from '@sveltejs/kit';
import ogs from 'open-graph-scraper';

export async function GET(event) {
	event.setHeaders({
		'cache-control': 'max-age=86400'
	});

	const url = event.url.searchParams.get('url');
	if (!url) {
		return json(
			{
				error: 'No url provided'
			},
			{
				status: 400
			}
		);
	}
	try {
		const data = await ogs({
			url
		});
		return json(data);
	} catch (error) {
		return json(error, {
			status: 500
		});
	}
}
