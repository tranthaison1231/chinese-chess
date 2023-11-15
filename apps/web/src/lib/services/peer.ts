import { browser } from '$app/environment';

export class PeerService {
	peerConnection: RTCPeerConnection | null = null;

	constructor() {
		if (!this.peerConnection && browser) {
			this.peerConnection = new RTCPeerConnection({
				iceServers: [
					{
						urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478']
					}
				]
			});
		}
	}

	async createAnswer(offer: RTCSessionDescriptionInit) {
		if (this.peerConnection) {
			this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
			const answer = await this.peerConnection.createAnswer();
			await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

			return answer;
		}

		return undefined;
	}

	async setRemoteDescription(answer: RTCSessionDescriptionInit) {
		if (this.peerConnection) {
			await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
		}
	}

	async makeCall() {
		if (this.peerConnection) {
			const offer = await this.peerConnection.createOffer();
			await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

			return offer;
		}

		return undefined;
	}
}

export default new PeerService();
