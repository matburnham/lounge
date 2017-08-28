"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const webpush = require("../webpush");
const sidebar = $("#sidebar");
const storage = require("../localStorage");
const utils = require("../utils");

socket.on("init", function(data) {
	$("#loading-page-message, #connection-error").text("Rendering…");

	const lastMessageId = utils.lastMessageId;
	let previousActive = 0;

	if (lastMessageId > -1) {
		previousActive = sidebar.find(".active").data("id");
		sidebar.find(".networks").empty();
	}

	if (data.networks.length === 0) {
		sidebar.find(".empty").show();

		$("#footer").find(".connect").trigger("click", {
			pushState: false,
		});
	} else {
		render.renderNetworks(data);
	}

	if (lastMessageId > -1) {
		$("#connection-error").removeClass("shown");
		$(".show-more-button, #input").prop("disabled", false);
		$("#submit").show();
	} else {
		if (data.token) {
			storage.set("token", data.token);
		}

		webpush.configurePushNotifications(data.pushSubscription, data.applicationServerKey);

		$("body").removeClass("signed-out");
		$("#loading").remove();
		$("#sign-in").remove();
	}

	let target;

	// Open last active channel
	if (previousActive > 0) {
		target = sidebar.find("[data-id='" + previousActive + "']").trigger("click", {
			replaceHistory: true
		});
	}

	// Otherwise open last active channel according to the server
	if (!previousActive || target.length === 0) {
		target = sidebar.find("[data-id='" + data.active + "']").trigger("click", {
			replaceHistory: true
		});

		// Otherwise open first channel in the sidebar
		if (target.length === 0) {
			target = sidebar.find(".chan")
				.eq(0)
				.trigger("click");

			// Otherwise open the connect window
			if (target.length === 0) {
				$("#footer").find(".connect").trigger("click", {
					pushState: false
				});
			}
		}
	}
});
