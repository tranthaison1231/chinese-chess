import { writable } from 'svelte/store';

interface ModalState {
	title?: string;
	description?: string;
	onOK?: () => void;
	onCancel?: () => void;
	open?: boolean;
	type: 'success' | 'error';
}

export const modalState = writable<ModalState>({
	type: 'success',
	open: false,
	title: 'Notification',
	description: 'Are you sure?'
});

type ModalProps = Omit<ModalState, 'open' | 'type'>;

function success(props: ModalProps) {
	modalState.set({
		...props,
		type: 'success',
		open: true
	});
}

function error(props: ModalProps) {
	modalState.set({
		...props,
		type: 'error',
		open: true
	});
}

export const notification = {
	success,
	error
};
