export const CustomOnboardStyle = `
	.modal {
		overflow-y: auto!important; /* Handle overflow */
		padding: 0px!important; /* Remove padding */

	}
	.outer-container {
		background: none;
		padding: 0px!important; /* Remove padding */

	}
	.modal .container {
		height: auto!important;
		padding: 0px!important; /* Remove padding */

	}
	section, section > div { 
		height: 100%;
		padding: 0px!important; /* Remove padding */

	}
	.modal-position > .max-height {
		max-height: none!important;
	}
	.width-100 {
		width: 100%!important;
	}
	.header, .mobile-header {
		display: none!important;
		padding: 0px!important; /* Remove padding */

	}
	.wallets-container {
		display: flex!important;
		flex-direction: column!important;
		width: 100%; /* Full width */
		overflow: hidden; /* Handle content overflow */
		padding: 8px!important; /* Remove padding */
	}
	.wallet-button-container {
		display: flex!important;
		justify-content: space-between; /* Space between name and icon */
		padding: 0px!important; /* Remove padding */
		border-radius: 8px!important;
	}
	.wallet-button-container .wallet-button-container-inner {
		width: 308px!important;
		height: 50px!important; /* Fixed height */
		gap: 8px!important;
		transition: all 0.2s;
		flex-flow: row!important;
		background: #ffffff05!important;
		border-radius: 8px!important;
		padding: 0!important; /* Remove padding */
	}
	.wallet-button-container button {
		border: none!important;
		padding: 0!important; /* Remove padding */
	}
	.wallet-button-container:hover .wallet-button-container-inner {
		border-color: #c599e0!important;
	}
	.wallet-button-container:hover button {
		background: none!important;
		border-radius: 8px!important;

	}
	.wallet-button-container .wallet-button-container-inner > div:first-child {
		width: 32px!important;
		height: 32px!important;
		border-radius: 8px!important;
		border: none;
		padding: 0!important; /* Remove padding */
	}
	.wallet-button-container .wallet-button-container-inner > .name {
		font-family: 'Raleway';
		color: #b9c0d4;
		font-size: 14px;
		font-weight: 600;
		line-height: 100%;
		max-width: none!important;
		transition: color 0.2s;
		text-align: left;
		padding: 0!important; /* Remove padding */
	}
	.button-container {
		display: none!important;
	}
	.warning-container {
		
	}
	.modal-overflow, .modal {
		width: 100%!important;
		overflow: hidden; /* Ensure no overflow */
	}
	.notice-container {
		// display: none!important;

	}
	.modal-container-mobile {
		margin: 0!important;
	}
	@media (max-width: 768px) {
		/* No specific styles needed for this media query as per your request */
	}
	@media (min-width: 768px) {
		.width-100 {
			width: 100%!important;
		}
		.max-height {
			max-height: none!important;
		}
		.modal > .container {
			height: auto!important;
		}
	}
`;
