//var swagger = "http://18.222.94.118:8080/api"; //AWS - Production
var swagger = "http://34.94.211.158:8080/api"; //GCP - Staging
var slideIndex = 0;
var elems = document.getElementsByClassName("mySlides");

/*
var imported = document.createElement('script');
imported.src = 'https://cdn.jsdelivr.net/jquery.validation/1.15.1/jquery.validate.min.js';
document.head.appendChild(imported);
*/

//Verify user logged in
function loginses() {
    if (sessionStorage.getItem("user_id") == null) {
        window.location.href = "/index.php/login";
    } else if (sessionStorage.getItem("user_type") == "Customer" && sessionStorage.getItem("user_type") != pageType) {
	    $('#hideBody').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
	    $("#err-alert").html("Please login as a contractor to access this feature");
		location.href = "#err-alert";
	} else if(sessionStorage.getItem("user_type") == "Contractor" && sessionStorage.getItem("user_type") != pageType) {
		$('#hideBody').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
	    $("#err-alert").html("Please login as a customer to access this feature");
		location.href = "#err-alert";
	}
}

//Loggedin User not allowed to Register
function alreadyLogin() {
    if (sessionStorage.getItem("user_id") != null) {
        $('#hideBody').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
        $("#err-alert").html("You are already logged in, please logout for Registration.");
		location.href = "#err-alert";
    }
}

//Login
function login() {
    $(function () {
        $('#cust_login').submit(function () {
            $("body").addClass("loading");
            var user_id = $('#user_name').val();
            var pw = $('#password').val();
            var formdata = '{' +
                '"active": 0,' +
                '"email": "string",' +
                '"firstName": "string",' +
                '"lastName": "string",' +
                '"password":"' + $('#password').val() + '",' +
                '"phNum": "string",' +
                '"referredBy": "string",' +
                '"userId": 0,' +
                '"userName":"' + $('#user_name').val() + '",' +
                '"userTypeId": 0' +
                '}';
            $.ajax({
                type: "POST",
                url: swagger + "/validateUser/",
                data: formdata,
                contentType: "application/json",
                datatype: "JSON",
                success: function (data) {
                    //$("body").removeClass("loading");
                    console.log(data);
                    if (data.userType == "Contractor") {
                        sessionStorage.setItem("user_id", data.id);
                        sessionStorage.setItem("user_name", data.userName);
						sessionStorage.setItem("firstName", data.firstName);
						sessionStorage.setItem("lastName", data.lastName);
                        sessionStorage.setItem("user_type", data.userType);
                        window.location.href = "/index.php/contractor/search-for-a-contract";
                    } else if (data.userType == "Customer") {
                        sessionStorage.setItem("user_id", data.id);
                        sessionStorage.setItem("user_name", data.userName);
						sessionStorage.setItem("firstName", data.firstName);
						sessionStorage.setItem("lastName", data.lastName);
                        sessionStorage.setItem("user_type", data.userType);
                        window.location.href = "/index.php/customer/show-my-projects";
                    } else {
                        $('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
                        $("#err-alert").html('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> User name or Password is incorrect.')
                        location.href = "#err-alert";
                        $("#err-alert").fadeTo(5000, 500).slideUp(500, function () {
                            $("#err-alert").slideUp(500);
                        });
						$("body").removeClass("loading");
                    }
                },
                error: function (err) {
                    $("body").removeClass("loading");
                    console.log(err);
                    $('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
                    $("#err-alert").html(err.responseJSON.message);
                    location.href = "#err-alert";
                    $("#err-alert").fadeTo(5000, 500).slideUp(500, function () {
                        $("#err-alert").slideUp(500);
                    });
                }
            });
            return false;
        });
    });
}

//Division Slider 1st Page
function DivSlide() {
	//alert(elems.length);
    for (var a = 1; a < elems.length; a++) {
        document.getElementById("submit").disabled = true;
        document.getElementById("prevBtn").disabled = true;
        elems[a].style.display = "none";
    }
}

//Next Button
function plusDivs(n) {
    document.getElementById("prevBtn").disabled = false;
    slideIndex += n;
    //alert(slideIndex);
    for (var a = 0; a < elems.length; a++) {
        if (slideIndex == a) {
            elems[a].style.display = "block";
            continue;
        }
        if (slideIndex == elems.length - 1) {
            document.getElementById("nxtBtn").disabled = true;
			if ($('#terms').is(":checked")) {
            document.getElementById("submit").disabled = false;
			}
			
        }
        elems[a].style.display = "none";
    }
}

//Previous Button
function prevDivs(n) {
    document.getElementById("nxtBtn").disabled = false;
	document.getElementById("submit").disabled = true;
    slideIndex += n;
    //alert(slideIndex);
    for (var a = 0; a < elems.length; a++) {
        if (slideIndex == a) {
            elems[a].style.display = "block";
            continue;
        }
        if (slideIndex == 0) {
            document.getElementById("prevBtn").disabled = true;
        }
        elems[a].style.display = "none";
    }
}

//I agree to the terms
function activateButton(terms) {
    if (terms.checked) {
        document.getElementById("submit").disabled = false;
    } else {
        document.getElementById("submit").disabled = true;
    }
}

//Customer Registration
function CustReg() {
    $(function () {
        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });

        var form = $("#cust_reg");
        $("#nxtBtn").click(function () {
            if (form.valid() == true) {
                plusDivs(1);
            }
        });

        form.validate({
            wrapper: 'div',
            errorLabelContainer: "#messageBox",
            rules: {
                first_name: "required",
                last_name: "required",
				customer_type: "required",
                phone_no: "required",
                address1: "required",
                address2: "required",
                address3: "required",
                address4: "required",
                address5: "required",
                user_name: "required",
                password: "required",
                retypePwd: "required",
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 8
                },
                retypePwd: {
                    equalTo: "#password"
                }
            },
            messages: {
                firstname: "Please enter your firstname",
                lastname: "Please enter your lastname",
                password: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 8 characters long"
                },
                email: "Please enter a valid email address"
            },
            submitHandler: function (form) {
                $("body").addClass("loading");
                var formdata = '{' +
                    '"custAddress": {' +
                    '"addressId": 0,' +
                    '"city":"' + $('#address2').val() + '",' +
                    '"country":"' + $('#address5').val() + '",' +
                    '"county": "string",' +
                    '"latitude": 0,' +
                    '"longitude": 0,' +
                    '"state":"' + $('#address3').val() + '",' +
                    '"street":"' + $('#address1').val() + '",' +
                    '"zip":"' + $('#address4').val() + '"' +
                    '},' +
                    '"firstName": "string",' +
                    '"id": 0,' +
                    '"user": {' +
                    '"active": 0,' +
                    '"email":"' + $('#email').val() + '",' +
                    '"firstName":"' + $('#first_name').val() + '",' +
                    '"lastName":"' + $('#last_name').val() + '",' +
                    '"password":"' + $('#password').val() + '",' +
                    '"phNum": "string",' +
                    '"referredBy": "string",' +
                    '"userId": 0,' +
                    '"userName":"' + $('#user_name').val() + '",' +
                    '"userTypeId": 1' +
                    '}' +
                    '}';
					console.log(formdata);
                $.ajax({
                    type: "POST",
                    url: swagger + "/createCustomer",
                    data: formdata,
                    contentType: "application/json",
                    datatype: "JSON",
                    success: function (data) {
                        $("body").removeClass("loading");
						console.log(data);
                        $('#cust_reg').html("<div id='message'></div>");
                        $("#message").html("<h1 class='success'><i class='fa fa-check'></i> Success</h1><p>Dear Customer,</p><p>Thank you for signing up with Blue Life, where construction work gets done.</p><p>Please note that:<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will now be able to submit a work-order. Use the \"Start a project\" function in the menu.<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will have access to the list of work-orders that you have created.<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will also be able to view the offers received from contractors on each of the work-order<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will be able to monitor the execution of the project, talk to contractor and schedule payments directly from our platform<br>&nbsp;&nbsp;&nbsp;&nbsp;* When viewing our services and updating the work-order milestones, internet connection is needed<br><br>To get started with a project, click the link below<br><a href='/index.php/customer/start-project'>Start a project</a><br><p>The Blue Life team welcomes you to our platform. We can be reached at hello@bluelife.io</p>Best Regards,<br>Team @ Blue Life.</p>");
                    },
                    error: function (err) {
                        $("body").removeClass("loading");
                        console.log(err);
                        $('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
						$("#err-alert").html(err.responseJSON.message);
						location.href = "#err-alert";
						$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
							$("#err-alert").slideUp(500);
						});
                    }
                });
                return false;
            }
        });
    });
}

//Start Project
function WorkOrder() {
    $(function () {
        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });

        var form = $("#work_order");
        $("#nxtBtn").click(function () {
            if (form.valid() == true) {
                plusDivs(1);
            }
        });
		
		var permitrule = ($('#permit').val() == 'yes') ? "required" : "";
		
        form.validate({
            wrapper: 'div',
            errorLabelContainer: "#messageBox",
            rules: {
                title: "required",
                street: "required",
                company_name: "required",
                city: "required",
                state: "required",
                zipcode: "required",
                country: "required",
                category: "required",
                summary: "required",
				permitObtainDate: permitrule,
            },
            submitHandler: function (form) {
                $("body").addClass("loading");
                var user_id = sessionStorage.getItem("user_id");
                var permit = ($('#permit').val() == 'yes') ? "Y" : "N";
                var obtain = ($('#permit').val() == 'yes') ? 1 : 0;
                var formdata = '{' +
                    '"assignedWoBidId": 0,' +
                    '"buildingPermitObtained":' + obtain + ',' +
                    '"buildingPermitObtainedDt":"' + $('#when').val() + '",' +
                    '"customerInfo": {' +
                    '"custAddress": {' +
                    '"addressId": 0,' +
                    '"city":"' + $('#address1').val() + '",' +
                    '"country":"' + $('#address4').val() + '",' +
                    '"county":"' + $('#address2').val() + '",' +
                    '"latitude": 0,' +
                    '"longitude": 0,' +
                    '"state":"' + $('#address2').val() + '",' +
                    '"street": "string",' +
                    '"zip":"' + $('#address3').val() + '"' +
                    '},' +
                    '"firstName": "string",' +
                    '"id":' + user_id + ',' +
                    '"user": {' +
                    '"active": 0,' +
                    '"email": "string",' +
                    '"firstName": "string",' +
                    '"lastName": "string",' +
                    '"password": "string",' +
                    '"phNum": "string",' +
                    '"referredBy": "string",' +
                    '"userId":' + user_id + ',' +
                    '"userName": "string",' +
                    '"userTypeId": 0' +
                    '}' +
                    '},' +
                    '"milestones": [' +
                    '{' +
                    '"completionDate":"' + $('#end_date').val() + '",' +
                    '"milestoneCost": 0,' +
                    '"milestoneDesc": "string",' +
                    '"milestoneId": 0,' +
                    '"milestonePercDue": 0,' +
                    '"notes": "string",' +
                    '"readyForContractorApproval": true,' +
                    '"readyForCustomerApproval": true,' +
                    '"status": 0' +
                    '}' +
                    '],' +
                    '"permitExpires":"' + $('#exp_date').val() + '",' +
                    '"permitObtained":"' + $('#when').val() + '",' +
                    '"preferLocalContractor": "string",' +
                    '"questionsToContractor": "string",' +
                    '"woAddress": {' +
                    '"addressId": 0,' +
                    '"city":"' + $('#address1').val() + '",' +
                    '"country":"' + $('#address4').val() + '",' +
                    '"county":"' + $('#address2').val() + '",' +
                    '"latitude": 0,' +
                    '"longitude": 0,' +
                    '"state":"' + $('#address2').val() + '",' +
                    '"street":"' + $('#street').val() + '",' +
                    '"zip":"' + $('#address3').val() + '"' +
                    '},' +
                    '"woAllowance":' + $('#reward').val() + ',' +
                    '"woBudget":' + $('#budget').val() + ',' +
                    '"woCategory":"' + $('#category').val() + '",' +
                    '"woDescription":"' + $('#summary').val() + '",' +
                    '"woEndDate":"' + $('#end_date').val() + '",' +
                    '"woPenalty":' + $('#penalty').val() + ',' +
                    '"woPrice": 0,' +
                    '"woStartDate":"' + $('#start_date').val() + '",' +
                    '"woStatus": 0,' +
                    '"woSubCategory": "string",' +
                    '"woSubject":"' + $('#title').val() + '",' +
                    '"workorderId": 0' +
                    '}';
                $.ajax({
                    type: "POST",
                    url: swagger + "/createPreliminaryWorkorder",
                    data: formdata,
                    datatype: "JSON",
                    contentType: "application/json",
                    success: function (data) {
                        $("body").removeClass("loading");
                        $('#work_order').html("<div id='message'></div>");
                        $("#message").html("<h1 class='success'><i class='fa fa-check'></i> Success</h1><p>Dear Customer,<br><br>Thank you for submitting a new work order using the Blue Life platform. Your work order is currently being reviewed by the system.<br><br>At this time,<br>&nbsp;&nbsp;&nbsp;&nbsp;* We will reach out to you if there are any questions<br><br>If there arent any questions,<br>&nbsp;&nbsp;&nbsp;&nbsp;* Your work order will be shared with contractors in our database and as well as published on our platform.<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will be receiving offers as they are submitted by the contractors<br><br>The work order entry, review and execution are as per Blue Life terms of use(TOU). If you need a copy of the TOU, please write to us at hello@bluelife.io.<br><br>Best Regards,<br>Team @ Blue Life</p><div align='center'><a href='/index.php/customer/start-project'><input type='button' class='w3-button w3-round-xxlarge w3-blue' value='Start a project'></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='/index.php/customer/show-my-projects'><input type='button' class='w3-button w3-round-xxlarge w3-blue' value='Show my projects'></a></div>");
                        console.log(data);
                    },
                    error: function (err) {
                        $("body").removeClass("loading");
                        console.log(err);
                        $('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
                        $("#err-alert").html(err.responseJSON.message);
                        location.href = "#err-alert";
                        $("#err-alert").fadeTo(5000, 500).slideUp(500, function () {
                            $("#err-alert").slideUp(500);
                        });
                    }
                });

                return false;
            }
        });
    });
}

//Show My Projects | Customer work order list
function cusWorkOrderList() {
	if(sessionStorage.getItem("user_type") == pageType) {
	$("body").addClass("loading");
    var user_id = sessionStorage.getItem("user_id");
    var formdata = '{"customerUserId": ' + user_id + '}';
    $.ajax({
        type: "POST",
        url: swagger + "/getAllPreliminaryWorkorders",
        contentType: "application/json",
        datatype: "JSON",
        data: formdata,
        success: function (data) {
            console.log(data);
			if(data.length == 0) {
				$('#norecords').html('<div id="err-alert" ></div><br>');
				$("#err-alert").html("<h3>No records found</h3>");
				location.href = "#err-alert";
			}
            var ttprnt = 0;

            data.forEach(function (item) {
				var ttchild = ttprnt + 1;
				var woSubject = (item.woSubject == null) ? "": item.woSubject;
				var street = (item.woAddress.street == null) ? "": item.woAddress.street+", ";
				var city = (item.woAddress.city == null) ? "": item.woAddress.city+", ";
				var county = (item.woAddress.county == null) ? "": item.woAddress.county+", ";
				var zip = (item.woAddress.zip == null) ? "": item.woAddress.zip+", ";
				var country = (item.woAddress.country == null) ? "": item.woAddress.country;
				var woStatus = (item.woStatus == null) ? "": item.woStatus;
				var woEndDate = (item.woEndDate == null) ? "": item.woEndDate;
                var element = $(
						'<tr data-tt-id="' + ttprnt + '">' +
                        //'<tr id="tr_tt-' + tt + '" data-tt-id="' + tt + '">' +
                        '<td><button id="woID" class="btnSelect" onclick="showDetailsByWo('+item.workorderId+')">' + item.workorderId + '</button></td>' +
                        '<td>' + woSubject + '</td>' +
                        '<td>' + street + city + county + zip + country + '</td>' +
                        '<td>' + woStatus + '</td>' +
                        '<td>' + woEndDate + '</td>' +
                        '</tr>' +
                        //'<span id="offer'+item.workorderId+'">' +
                        '<tr data-tt-id="' + ttchild + '" data-tt-parent-id="' + ttprnt + '"><td colspan="3" style="font-size:16px;">Contractor offers for this work order</td></tr>' +
                        '<tr data-tt-id="' + ttchild + '" data-tt-parent-id="' + ttprnt + '" class="w3-text-blue">' +

                        '&nbsp;&nbsp;&nbsp;&nbsp;<td style="color: green;">Offer #</th>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;<td style="color: green;">Contractor Name</th>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;<td style="color: green;">Offer amount</th>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;<td style="color: green;">Completion date</th>' +

                        '</tr>');
                $("#workOrderTable").append(element);
				
                $.ajax({
                    type: "POST",
                    url: swagger + "/getInterestedContractorForWorkorder",
                    contentType: "application/json",
					async: false,
                    datatype: "JSON",
                    data: '{"workOrderId": ' + item.workorderId + '}',
                    success: function (data) {
                        console.log(data);
                        data.forEach(function (items) {
							var firmName = (items.contractorInfo.firmName == null) ? "": items.contractorInfo.firmName;
							var estimatedBudget = (items.estimatedBudget == null) ? "": items.estimatedBudget;
							var wobEndDt = (items.wobEndDt == null) ? "": items.wobEndDt;
                            var elements = $(
                                    '<tr data-tt-id="' + ttchild + '" data-tt-parent-id="' + ttprnt + '">' +
									'<td><button id="wobid" class="btnSelect" onclick="showDetailsByBid('+items.workOrderBidId+', '+items.approvedBid+')">' + items.workOrderBidId + '</button></td>' +
                                    '<td> ' + firmName + '</td>' +
                                    '<td> ' + estimatedBudget + '</td>' +
                                    '<td> ' + wobEndDt + '</td>' +
                                    '<td><button name="'+items.workOrderBidId+'-show" id="'+items.workOrderBidId+'" class="w3-bar-item w3-button w3-round-xlarge tablink w3-blue" onclick="showDetailsByBid('+items.workOrderBidId+', '+items.approvedBid+')">Show details</button>' +
									'<button name="'+items.workOrderBidId+'-select" id="'+items.workOrderBidId+'" class="w3-bar-item w3-button w3-round-xlarge tablink w3-blue" onclick="selectOffer('+items.workOrderBidId+')">Select Offer</button></td>' +
                                    '</tr>');
                           
							$("#workOrderTable").append(elements);
							if(items.approvedBid == true){
								//document.getElementByName(items.workOrderBidId+'-show').style.display = "none";
								document.getElementsByName(items.workOrderBidId+'-select')[0].style.display = "none";
							}
                        });
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                ttprnt = ttchild + 1;
				ttchild = ttprnt + 1;
            });
			$("body").removeClass("loading");
            $("#workOrderTable").treetable({
                expandable: true
            });
        },

        error: function (err) {
			$("body").removeClass("loading");
			console.log(err);
			$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
			$("#err-alert").html(err.responseJSON.message);
			location.href = "#err-alert";
			$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
				$("#err-alert").slideUp(500);
			});
        }
    });
}
}

//Select Offer
function selectOffer(bidId) {
    var formdata = '{' +
        '"workOrderBidId":' + bidId + ',' +
        '"workOrderId": 0' +
        '}';
    console.log(formdata);
    $.ajax({
        type: "POST",
        url: swagger + "/selectOffer",
        contentType: "application/json",
        datatype: "JSON",
        data: formdata,
        success: function (data) {
            console.log(data);
			window.location.href = "/index.php/customer/show-my-projects";
        },
        error: function (err) {
            $("body").removeClass("loading");
			console.log(err);
			$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
			$("#err-alert").html(err.responseJSON.message);
			location.href = "#err-alert";
			$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
				$("#err-alert").slideUp(500);
			});
        }
    });
}

//Show Bid Details
function showDetailsByBid(bidId, offer) {
    sessionStorage.setItem("woBid", bidId);
    sessionStorage.setItem("woid", 0);
    sessionStorage.setItem("offer", offer);
    sessionStorage.setItem("tabtype", "clickedByBid");
    window.location.href = "/index.php/work-order-execution";
    //window.location.href = "wo_execution.html";
}

//Show WO Details
function showDetailsByWo(woId) {
    sessionStorage.setItem("woBid", 0);
    sessionStorage.setItem("woid", woId);
    //sessionStorage.setItem("offer", offer);
    sessionStorage.setItem("tabtype", "clickedByWo");
    window.location.href = "/index.php/work-order-execution";
    //window.location.href = "wo_execution.html";
}

//Work Order id click function redirecting to work order execution page
/*
$(function () {
    $("#workOrderTable").on('click', '#woID', function () {
        var currentRow = $(this).closest("tr");
        var formdata = currentRow.find("td:eq(0)").text();
		//alert(formdata);
		sessionStorage.setItem("woid", formdata);
		sessionStorage.setItem("woBid", 0);
		if(sessionStorage.getItem("user_type") == "Customer"){
			sessionStorage.setItem("tabtype", "custwo");
		} else if(sessionStorage.getItem("user_type") == "Contractor"){
			sessionStorage.setItem("tabtype", "contwo");
		}
        //window.location.href = "/index.php/work-order-execution";
		window.location.href = "wo_execution.html";
    });
});


//Work Order Bid id click function redirecting to work order execution page
$(function () {
    $("#workOrderTable").on('click', '#wobid', function () {
        var currentRow = $(this).closest("tr");
        var formdata = currentRow.find("td:eq(0)").text();
		//alert(formdata);
		sessionStorage.setItem("woBid", formdata);
		sessionStorage.setItem("woid", 0);
        window.location.href = "/index.php/work-order-execution";
		//window.location.href = "wo_execution.html";
    });
});
*/

//Contractor Registration
function ContReg() {
	$(function () {
		jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });

        var form = $("#cont_reg");
        $("#nxtBtn").click(function () {
            if (form.valid() == true) {
                plusDivs(1);
            }
        });

        form.validate({
			wrapper: 'div',
			errorLabelContainer: "#messageBox",
			rules: {
				first_name: "required",
				last_name: "required",
				company_name: "required",
				phone_no: "required",
				address1: "required",
				address2: "required",
				address3: "required",
				address4: "required",
				address5: "required",
				user_name: "required",
				password: "required",
				re_enter_pwd: "required",
				cslb_lic_no: "required",
				lic_state: "required",
				company_type: "required",
				work_comp_ins: "required",
				work_comp_policy_no: "required",
				comm_gen_liab_provider: "required",
				comm_gen_liab_pol_no: "required",
				email: {
					required: true,
					email: true
				},
				password: {
					required: true,
					minlength: 8
				},
                re_enter_pwd: {
                    equalTo: "#password"
                }
			},
			messages: {
				firstname: "Please enter your firstname",
				lastname: "Please enter your lastname",
				password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 8 characters long"
				},
				email: "Please enter a valid email address"
			},
			submitHandler: function (form) {
				$("body").addClass("loading");
				 function licenseId(str) {
				     return str
				     .replace(/[\\]/g, '\\\\')
				     .replace(/[\"]/g, '\\\"')
				     .replace(/[\/]/g, '\\/')
				     .replace(/[\b]/g, '\\b')
				     .replace(/[\f]/g, '\\f')
				     .replace(/[\n]/g, '\\n')
				     .replace(/[\r]/g, '\\r')
				     .replace(/[\t]/g, '\\t');
				 }
				 //alert(licenseId($('#cslb_lic_no').val()));
				var formdata = '{' +
					'"commGenPolicy":"' + $('#comm_gen_liab_pol_no').val() + '",' +
					'"commGeneralLiabProvider":"' + $('#comm_gen_liab_provider').val() + '",' +
					'"contractorId": 0,' +
					'"contractorUser": {' +
					'"active": 0,' +
					'"email":"' + $('#email').val() + '",' +
					'"firstName":"' + $('#first_name').val() + '",' +
					'"lastName":"' + $('#last_name').val() + '",' +
					'"password":"' + $('#password').val() + '",' +
					'"phNum":"' + $('#phone_no').val() + '",' +
					'"referredBy": "string",' +
					'"userId": 0,' +
					'"userName":"' + $('#user_name').val() + '",' +
					'"userTypeId": 0' +
					'},' +
					'"email":"' + $('#email').val() + '",' +
					'"firmAddress": {' +
					'"addressId": 0,' +
					'"city":"' + $('#address2').val() + '",' +
					'"country":"' + $('#address3').val() + '",' +
					'"county":"' + $('#address5').val() + '",' +
					'"latitude": 0,' +
					'"longitude": 0,' +
					'"state":"' + $('#address5').val() + '",' +
					'"street":"' + $('#address1').val() + '",' +
					'"zip":"' + $('#address4').val() + '"' +
					'},' +
					'"firmName":"' + $('#company_name').val() + '",' +
					'"firmType":"' + $('#company_type').val() + '",' +
					'"insId": 0,' +
					'"licId":"' + licenseId($('#cslb_lic_no').val()) + '",' +
					'"licenseExpDate":"' + $('#lic_exp').val() + '",' +
					'"licenseNum":"' + $('#cslb_lic_no').val() + '",' +
					'"licensedState":"' + $('#lic_state').val() + '",' +
					'"phoneNumber":"' + $('#phone_no').val() + '",' +
					'"workCompInsurenceProvider":"' + $('#work_comp_ins').val() + '",' +
					'"workCompPolicy":"' + $('#work_comp_policy_no').val() + '"' +
					'}';
				$.ajax({
					type: "POST",
					url: swagger + "/createContractor",
					data: formdata,
					contentType: "application/json",
					datatype: "JSON",
					success: function (data) {
						$("body").removeClass("loading");
						console.log(data);
						$('#cont_reg').html("<div id='message'></div>");
						$("#message").html("<h1 class='success'><i class='fa fa-check'></i> Success</h1><p>Dear Contractor,</p><p>Thank you for signing up with Blue Life, where construction work gets done.</p><p>Please note that:<br>&nbsp;&nbsp;&nbsp;&nbsp;* Your account is currently being reviewed by the Blue Life team. We will send you a confirmation as soon as the review is complete. This typically takes about 1-5 business days. Once the review is complete and your account has been activated,<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will be able to browse customer work-order's by entering a zip code.<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will have access to the list of offers that you have submitted through our platform.<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will also be able to view the offers that you have currently contracted through our platform.<br>&nbsp;&nbsp;&nbsp;&nbsp;* When viewing our services and updating the work-order milestones, internet connection is needed<br><br>To browse work-orders by using a zip code, click the link below<br><a href='/index.php/contractor/search-for-a-contract'>Find contract work</a><br><p>The Blue Life team welcomes you to our platform. We can be reached at hello@bluelife.io</p>Best Regards,<br>Team @ Blue Life.</p>");
					},
					error: function (err) {
						$("body").removeClass("loading");
						console.log(err);
						$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
						$("#err-alert").html(err.responseJSON.message);
						location.href = "#err-alert";
						$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
							$("#err-alert").slideUp(500);
						});
					}
				});
				return false;
			}
		});
	});
}

// Map Zip Search
function zipSearch() {
    $(function () {
        $('#zip_search').submit(function () {
			$("body").addClass("loading");
            var formdata = '{"zipCode":' + $('#zip').val() + '}';
            $.ajax({
                type: "POST",
                url: swagger + "/searchWorkordersByZip",
                data: formdata,
                contentType: "application/json",
                datatype: "JSON",

                success: function (data) {
					$("body").removeClass("loading");
                    console.log(data);
					if (data.length == 0) {
                        $("#map").html("<h1>No work orders found</h1>");
					} else {
						sessionStorage.setItem("latlong", JSON.stringify(data));
						location.reload();
					}
                },

                error: function (err) {
					$("body").removeClass("loading");
					console.log(err);
					$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
					$("#err-alert").html(err.responseJSON.message);
					location.href = "#err-alert";
					$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
						$("#err-alert").slideUp(500);
					});
                }
            });
            return false;
        });
    });
}

//Show My Contracts
function conWorkOrderList() {
    var user_id = sessionStorage.getItem("user_id");
	var formdata = '{"contractorId": ' + user_id + '}';
	//alert(formdata);
    $.ajax({
        type: "POST",
		url: swagger + "/getAllBidsForContractor",
        contentType: "application/json",
        datatype: "JSON",
		data: formdata,
        success: function (data) {
            console.log(data);
            data.forEach(function (item) {
                var element = $(
                        '<tr>' +
                        '<td><button id="'+item.workOrderBidId+'" class="btnSelect" onclick="woexetabs('+item.workOrderBidId+', '+item.approvedBid+')">'+item.workOrderBidId+'</button></td>' +
                        '<td>' + item.workOrderInfo.customerInfo.firstName + '</td>' +
                        '<td>' + item.workOrderInfo.woSubject + '</td>' +
                        '<td>' + item.workOrderInfo.woAddress.street + ', ' + item.workOrderInfo.woAddress.city + ', ' + item.workOrderInfo.woAddress.county + ', ' + item.workOrderInfo.woAddress.zip + ', ' + item.workOrderInfo.woAddress.country + '</td>' +
                        '<td>' + item.workOrderInfo.woStatus + '</td>' +
                        '<td>' + item.workOrderInfo.woEndDate + '</td>' +
                        '</tr>');
                $("#liwo").append(element);
            });
        },
        error: function (err) {
            $("body").removeClass("loading");
			console.log(err);
			$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
			$("#err-alert").html(err.responseJSON.message);
			location.href = "#err-alert";
			$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
				$("#err-alert").slideUp(500);
			});
        }
    });   
}

//Contractor Wo Execution page redirecting
function woexetabs(conwobidid, offer){
	sessionStorage.setItem("woid", 0);
	sessionStorage.setItem("woBid", conwobidid);
	sessionStorage.setItem("offer", offer);
	sessionStorage.setItem("tabtype", "clickedByBid");
	window.location.href = "/index.php/work-order-execution";
	//window.location.href = "wo_execution.html";
}

//Submit Interest
function subInt() {
    $(function () {
        $('#sub_int').submit(function () {
            $("body").addClass("loading");
            if ($('#revWO').is(":checked")) {
                var reviewWo = true;
            } else {
                var reviewWo = false;
            }

            var formdata = '{' +
                '"aboutContractor":"' + $('#abtCont1').val() + ' ' + $('#abtCont2').val() + ' ' + $('#abtCont3').val() + '",' +
                '"approvedContractor": true,' +
                '"bankingWith":"' + $('#bankwith').val() + '",' +
                '"contractorId":"' + sessionStorage.getItem("user_id") + '",' +
                '"estimatedBudget":"' + $('#estbudget').val() + '",' +
                '"milestones": [' +
                getMilestoneJSON() +
                '],' +
                '"question": "string",' +
                '"referredBy":"' + $('#referredby').val() + '",' +
                '"reviewedWorkOrderInfo":"' + reviewWo + '",' +
                '"subContractorList": [' +
                getMysubcontrJSON() +
                '],' +
                '"transactionPartner": "string",' +
                '"useSubContractor": true,' +
                '"wobEndDt": "2020-01-20",' +
                '"wobStartDt": "2020-01-20",' +
                '"workOrderBidId": 0,' +
                '"workOrderInfo": {' +
                '"assignedWoBidId": 0,' +
                '"buildingPermitObtained": 0,' +
                '"buildingPermitObtainedDt": "2020-01-20",' +
                '"customerInfo": {' +
                '"custAddress": {' +
                '"addressId": 0,' +
                '"city": "string",' +
                '"country": "string",' +
                '"county": "string",' +
                '"latitude": 0,' +
                '"longitude": 0,' +
                '"state": "string",' +
                '"street": "string",' +
                '"zip": "string"' +
                '},' +
                '"firstName": "string",' +
                '"id": 0,' +
                '"user": {' +
                '"active": 0,' +
                '"email": "string",' +
                '"firstName": "string",' +
                '"lastName": "string",' +
                '"password": "string",' +
                '"phNum": "string",' +
                '"referredBy": "string",' +
                '"userId": 0,' +
                '"userName": "string",' +
                '"userTypeId": 0' +
                '}' +
                '},' +
                '"milestones": [' +
                '{' +
                '"completionDate": "2020-01-20",' +
                '"milestoneCost": 0,' +
                '"milestoneDesc": "string",' +
                '"milestoneId": 0,' +
                '"milestonePercDue": "string",' +
                '"notes": "string",' +
                '"readyForContractorApproval": true,' +
                '"readyForCustomerApproval": true,' +
                '"status": 0' +
                '}' +
                '],' +
                '"permitExpires": "2020-01-01",' +
                '"permitObtained": "2020-01-01",' +
                '"preferLocalContractor": "string",' +
                '"questionsToContractor": "string",' +
                '"woAddress": {' +
                '"addressId": 0,' +
                '"city": "string",' +
                '"country": "string",' +
                '"county": "string",' +
                '"latitude": 0,' +
                '"longitude": 0,' +
                '"state": "string",' +
                '"street": "string",' +
                '"zip": "string"' +
                '},' +
                '"woAllowance": 0,' +
                '"woBudget": 0,' +
                '"woCategory": "string",' +
                '"woDescription": "string",' +
                '"woEndDate": "2020-01-01",' +
                '"woPenalty": 0,' +
                '"woPrice": 0,' +
                '"woStartDate": "2020-01-01",' +
                '"woStatus": 0,' +
                '"woSubCategory": "string",' +
                '"woSubject": "string",' +
                '"workorderId":"' + sessionStorage.getItem("woid") + '"' +
                '}' +
                '}';
            console.log(formdata);
            $.ajax({
                type: "POST",
                url: swagger + "/submitInterestOnWorkorder",
                data: formdata,
                contentType: "application/json",
                datatype: "JSON",
                success: function (data) {
					console.log(data);
                    $("body").removeClass("loading");
                    $('#sub_int').html("<div id='message'></div>");
                    $("#message").html("<h1 class='success'><i class='fa fa-check'></i> Success</h1><p>Dear Contractor,<br><br>Thank you for submitting your offer on the work order. Your offer is currently being reviewed by the system.<br><br>At this time,<br>&nbsp;&nbsp;&nbsp;&nbsp;* We will reach out to you if there are any questions<br><br>If there arent any questions,<br>&nbsp;&nbsp;&nbsp;&nbsp;* Your offer will be shared with customer for further review.<br>&nbsp;&nbsp;&nbsp;&nbsp;* You will be receiving queries, confirmation from the customer directly.<br><br>The offer entry, review and execution are as per Blue Life terms of use(TOU). If you need a copy of the TOU, please write to us at hello@bluelife.io.<br><br>Best Regards,<br>Team @ Blue Life</p>");
					/*
					setTimeout(function(){
						window.location.href = "/index.php/contractor/search-for-a-contract";
					}, 3000);
					*/
                },
                error: function (err) {
                    $("body").removeClass("loading");
                    console.log(err);
                    $('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
                    $("#err-alert").html(err.responseJSON.message);
                    location.href = "#err-alert";
                    $("#err-alert").fadeTo(5000, 500).slideUp(500, function () {
                        $("#err-alert").slideUp(500);
                    });
                }
            });
            return false;
        });
    });
}

/****************Work Order Execution Tab Screens*****************/
//Status tab
function StatusTab() {
    //$('#statusbtn').click(function () {
    var formdata = '{' +
        '"workOrderBidId":' + parseInt(sessionStorage.getItem("woBid")) + ',' +
        '"workOrderId":' + parseInt(sessionStorage.getItem("woid")) +
        '}';
    console.log(formdata);
    $.ajax({
        type: "POST",
        url: swagger + "/getStatusTabInfo",
        contentType: "application/json",
        datatype: "JSON",
        data: formdata,
        success: function (data) {
            console.log(data);
			var custAprlMsg = (data.customerApprovalMessage == null) ? "No approvals pending at this time": data.customerApprovalMessage;
			var contAprlMsg = (data.contractorApprovalMessage == null) ? "No approvals pending at this time": data.contractorApprovalMessage;
            $("#milestoneMessage").html(data.overallStatus);
            $("#milestoneStatus").html(data.projectStatus);
            $("#customerApprovalMesssge").html(custAprlMsg);
            $("#contractorApprovalMesssge").html(contAprlMsg);
            //$("#ganttchartLink").attr("src", data.ganttChartURL);
            $("#commentsText").html(data.comments);
            $("#clickToRespondMessage").hide();

            $("#clickToRespond").click(function () {

                $("#clickToRespondMessage").slideToggle("slow");
            });

            if (data.customerApprovalMessage == null) {
                $("#customerApprovalButton").hide();
            }
            if (data.clickToRespond == "no") {
                $("#clickToRespond").hide();
            }
            if (data.clickToChat == "no") {
                $("#clickToChat").hide();
            }

            //alert(data); alert(data[1].workorderId);

        },
        error: function (err) {
            $("body").removeClass("loading");
            console.log(err);
            $('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
            $("#err-alert").html(err.responseJSON.message);
            location.href = "#err-alert";
            $("#err-alert").fadeTo(5000, 500).slideUp(500, function () {
                $("#err-alert").slideUp(500);
            });
        }
    });
    //});
}

// Work Order Details
function WorkOrderDetails() {
    
        var formdata = '{'+
				'"workOrderBidId":'+parseInt(sessionStorage.getItem("woBid"))+','+
				'"workOrderId":'+parseInt(sessionStorage.getItem("woid"))+
				'}';
		//alert(formdata);
        $.ajax({
            type: "POST",
            url: swagger + "/getWorkOrderTabInfo",
            contentType: "application/json",
			datatype: "JSON",
			data: formdata,
            success: function (data) {
                console.log(data);
                $("#customerName").attr("value", data.cInfo.user.firstName);
                $("#constructionSite").attr("value", data.woAddress.street+", "+data.woAddress.city+", "+data.woAddress.county+", "+data.woAddress.country);
                $("#zipCode").attr("value", data.woAddress.zip);
                $("#projectDescription").attr("value", data.workOrderInfo.woDescription);
                $("#preferredStartDate").attr("value", data.workOrderInfo.woStartDate);
                $("#preferredEndDate").attr("value", data.workOrderInfo.woEndDate);
                $("#penaltyForLateCompletion").attr("value", data.workOrderInfo.woPenalty);
				am = 1;
                data.milestones.forEach(function (item) {
                    var element = $(
                            '<tr>' +
                            '<td>' + item.completionDate + '</td>' +
                            '<td>' + item.milestoneDesc + '</td>' +
                            '<td>' + item.status + '</td>' +
                            '<td style="text-align:right;">$' + item.milestoneCost + '.00</td>' +
                            '<td style="text-align:center;"><button id="appvoreMilestone'+am+'" class="w3-bar-item w3-button w3-round-xlarge tablink w3-blue" onclick="approveMilestone('+item.milestoneId+')">Approve milestone</button></td>' +
                            '</tr>');
                    $("#milestones").append(element);
					
					if(sessionStorage.getItem("user_type") == "Contractor") {
						document.getElementById("appvoreMilestone"+am).disabled = true;
					} else if(item.readyForCustomerApproval == false){
						//document.getElementById("appvoreMilestone"+am).style.display = "none";
						document.getElementById("appvoreMilestone"+am).disabled = true;
					}
					
					am++;
                });

                //alert(data); alert(data[1].workorderId);

            },
            error: function (err) {
                $("body").removeClass("loading");
				console.log(err);
				$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
				$("#err-alert").html(err.responseJSON.message);
				location.href = "#err-alert";
				$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
					$("#err-alert").slideUp(500);
				});
            }
        });
    
}

// Approve Milestone
function approveMilestone(approveMilestoneId) {
	var formdata = '{' +
        '"milestoneId":' + approveMilestoneId +
        '}';
    console.log(formdata);
    $.ajax({
        type: "POST",
        url: swagger + "/approveMileStoneForPayment",
        contentType: "application/json",
        datatype: "JSON",
        data: formdata,
        success: function (data) {
            console.log(data);
			location.reload();
        },
        error: function (err) {
            $("body").removeClass("loading");
			console.log(err);
			$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
			$("#err-alert").html(err.responseJSON.message);
			location.href = "#err-alert";
			$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
				$("#err-alert").slideUp(500);
			});
        }
    });
}

//Contractor information
function ContractorTab() {
    //$('#ContractorDetails').click(function () {
    var formdata = '{' +
        '"workOrderBidId":' + parseInt(sessionStorage.getItem("woBid")) + ',' +
        '"workOrderId":' + parseInt(sessionStorage.getItem("woid")) +
        '}';
    $.ajax({
        type: "POSt",
        url: swagger + "/getContractorTabInfo",
        contentType: "application/json",
        datatype: "JSON",
        data: formdata,
        success: function (data) {
            console.log(data);
            $("#contractFirmName").attr("value", data.companyName);
            $("#contactNumber").attr("value", data.phNum);
            $("#bidPrice").attr("value", data.quotedAmount);
			sm = 1;
            data.milestones.forEach(function (item) {
                var element = $(
                        '<tr>' +
                        '<td>' + item.completionDate + '</td>' +
                        '<td>' + item.milestoneDesc + '</td>' +
                        '<td>' + item.status + '</td>' +
                        '<td style="text-align:right;">$' + item.milestoneCost + '.00</td>' +
                        '<td style="text-align:center;"><button id="submitMilestone'+sm+'" class="w3-bar-item w3-button w3-round-xlarge tablink w3-blue" onclick="submitMilestone('+item.milestoneId+')">Submit milestone</button></td>' +
                        '</tr>');
                $("#mileStoneList").append(element);
				if(sessionStorage.getItem("user_type") == "Customer") {
						document.getElementById("submitMilestone"+sm).disabled = true;
					} else if(item.readyForContractorApproval == false){
					document.getElementById("submitMilestone"+sm).disabled = true;
				}
				sm++;
            });
/*
            data.subContractorList.forEach(function (item) {
                var element = $(
                        '<tr>' +
                        '<td>' + 1 + '</td>' +
                        '<td>' + item.contractFirmName + '</td>' +
                        '<td>' + item.contactNumber + '</td>' +
                        '<td>' + item.address + '</td>' +
                        '</tr>');
                $("#subContractorTble").append(element);
            });
*/
            //alert(data); alert(data[1].workorderId);

        },
        error: function (err) {
            $("body").removeClass("loading");
			console.log(err);
			$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
			$("#err-alert").html(err.responseJSON.message);
			location.href = "#err-alert";
			$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
				$("#err-alert").slideUp(500);
			});
        }
    });
    //});
}

function askTheCustomer() {
    $('#asktocustomer').click(function () {
        $("body").addClass("loading");
        var curDate = $.datepicker.formatDate('yy-mm-dd', new Date());
        var formdata = '{' +
            '"contractorId": 0,' +
            '"createdDt": "' + curDate + '",' +
            '"description":"' + $('#askCustomer').val() + '",' +
            '"id": 0,' +
            '"parentCommentId": 0,' +
            '"status": "string",' +
            '"userName":"'+sessionStorage.getItem("user_name")+'",' +
            '"woId":"'+parseInt(sessionStorage.getItem("woid"))+'",' +
            '"wobId":"'+parseInt(sessionStorage.getItem("woBid"))+'"' +
            '}';
			//alert(formdata);
        $.ajax({
            type: "POST",
            url: swagger + "/submitComment",
            data: formdata,
            contentType: "application/json",
            datatype: "JSON",
            success: function (data) {
                $("body").removeClass("loading");
                console.log(data);
            },
            error: function (err) {
                $("body").removeClass("loading");
                console.log(err);
                $('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
                $("#err-alert").html(err.responseJSON.message);
                location.href = "#err-alert";
                $("#err-alert").fadeTo(5000, 500).slideUp(500, function () {
                    $("#err-alert").slideUp(500);
                });
            }
        });
        return false;
    });
}

function askTheContractor() {
    $('#asktocontractor').click(function () {
        $("body").addClass("loading");
        var curDate = $.datepicker.formatDate('yy-mm-dd', new Date());
        var formdata = '{' +
            '"contractorId":"' + parseInt(sessionStorage.getItem("user_id")) + '",' +
            '"createdDt": "' + curDate + '",' +
            '"description":"' + $('#askContractor').val() + '",' +
            '"id": 0,' +
            '"parentCommentId": 0,' +
            '"status": "string",' +
            '"userName":"' + sessionStorage.getItem("user_name") + '",' +
            '"woId":"' + parseInt(sessionStorage.getItem("woid")) + '",' +
            '"wobId":"' + parseInt(sessionStorage.getItem("woBid")) + '"' +
            '}';
        alert(formdata);
        $.ajax({
            type: "POST",
            url: swagger + "/submitComment",
            data: formdata,
            contentType: "application/json",
            datatype: "JSON",
            success: function (data) {
                $("body").removeClass("loading");
                console.log(data);
            },
            error: function (err) {
                $("body").removeClass("loading");
                console.log(err);
                $('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
                $("#err-alert").html(err.responseJSON.message);
                location.href = "#err-alert";
                $("#err-alert").fadeTo(5000, 500).slideUp(500, function () {
                    $("#err-alert").slideUp(500);
                });
            }
        });
        return false;
    });
}

// Submit Milestone
function submitMilestone(submitMilestoneId) {
	var formdata = '{' +
        '"milestoneId":' + submitMilestoneId +
        '}';
    console.log(formdata);
    $.ajax({
        type: "POST",
        url: swagger + "/submitMileStoneForPayment",
        contentType: "application/json",
        datatype: "JSON",
        data: formdata,
        success: function (data) {
            console.log(data);
			location.reload();
        },
        error: function (err) {
            $("body").removeClass("loading");
			console.log(err);
			$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
			$("#err-alert").html(err.responseJSON.message);
			location.href = "#err-alert";
			$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
				$("#err-alert").slideUp(500);
			});
        }
    });
}

//Miscellaneous Cost
function MiscellaneousCost() {
		 var formdata = '{'+
				'"workOrderBidId":'+parseInt(sessionStorage.getItem("woBid"))+','+
				'"workOrderId":'+parseInt(sessionStorage.getItem("woid"))+
				'}';
        $.ajax({
            type: "POST",
            url: swagger + "/getMiscellaneousTabInfo",			
            contentType: "application/json",
			datatype: "JSON",
			data: formdata,
            success: function (data) {
                console.log(data);
				/*
                $("#expDesc").attr("value", data.cost.expenseDesc);
                $("#expenseDate").attr("value", data.cost.expenseDate);
                $("#expenseAmount").attr("value", data.cost.expenseAmount);

                data.misceExpense.forEach(function (item) {
                    var element = $(
                            '<tr>' +
                            '<td>' + 1 + '</td>' +
                            '<td>' + item.expenseDesc + '</td>' +
                            '<td>' + item.expenseDate + '</td>' +
                            '<td>' + item.expenseAmount + '</td>' +
                            '</tr>');
                    $("#expensesTable").append(element);
                });

                //alert(data); alert(data[1].workorderId);
				*/
            },
            error: function (err) {
                $("body").removeClass("loading");
				console.log(err);
				$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
				$("#err-alert").html(err.responseJSON.message);
				location.href = "#err-alert";
				$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
					$("#err-alert").slideUp(500);
				});
            }
        });
}

//Payment Details
function PaymentDetails() {
        var formdata = '{'+
				'"workOrderBidId":'+parseInt(sessionStorage.getItem("woBid"))+','+
				'"workOrderId":'+parseInt(sessionStorage.getItem("woid"))+
				'}';
        $.ajax({
            type: "POST",
            url: swagger + "/getPaymentTabInfo",
            contentType: "application/json",
			datatype: "JSON",
			data: formdata,
            success: function (data) {
                console.log(data);
				var approvedContractor = (data.approvedContractor == true) ? "Yes": "No";
				var customerDepositComplete = (data.customerDepositComplete == true) ? "Yes": "No";
				var transactionBroker = (data.transactionBroker == null) ? "": data.transactionBroker;
                $("#finInstitue").attr("value", data.finInstName);
                $("#contractorApproved").attr("value", approvedContractor);
                $("#customerDepositComplete").attr("value", customerDepositComplete);
                $("#paymentID").attr("value", transactionBroker);

                data.milestones.forEach(function (item) {
					var notes = (item.notes == null) ? "": item.notes;
                    var element = $(
                            '<tr>' +
                            '<td>' + item.completionDate + '</td>' +
                            '<td>' + item.milestoneDesc + '</td>' +
                            '<td>' + item.status + '</td>' +
                            '<td style="text-align:right;">$' + item.milestoneCost +'.00</td>' +
                            '<td>' + notes + '</td>' +
                            '</tr>');
                    $("#payments").append(element);
                });

                //alert(data); alert(data[1].workorderId);

            },
            error: function (err) {
                $("body").removeClass("loading");
				console.log(err);
				$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
				$("#err-alert").html(err.responseJSON.message);
				location.href = "#err-alert";
				$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
					$("#err-alert").slideUp(500);
				});
            }
        });
}

//History Tab
function HistoryTab() {
	var formdata = '{'+
				'"workOrderBidId":'+parseInt(sessionStorage.getItem("woBid"))+','+
				'"workOrderId":'+parseInt(sessionStorage.getItem("woid"))+
				'}';
        $.ajax({
            type: "POST",
            url: swagger + "/getHistoryTabInfo",
            contentType: "application/json",
			datatype: "JSON",
			data: formdata,
            success: function (data) {
                console.log(data);
				/*
                $("#finInstitue").attr("value", data.finInstitue);
                $("#contractorApproved").attr("value", data.contractorApproved);
                $("#customerDepositComplete").attr("value", data.customerDepositComplete);
                $("#paymentID").attr("value", data.paymentID);
*/
                data.forEach(function (item) {
                    var element = $(
                            '<li class="w3-bar">' +
                            '<img src="img_avatar5.png" class="w3-bar-item w3-circle w3-hide-small" style="width:85px">' +
                            '<div class="w3-bar-item">' +
                            '<span class="w3-large">On ' + item.createdDt + ' ' + item.userName + ':</span><br>' +
                            '<span>' + item.description + '</span>' +
                            '</div>' +
                            '</li>');
                    $("#createdHistory").append(element);
                });
				
                //alert(data); alert(data[1].workorderId);
				
            },
            error: function (err) {
                $("body").removeClass("loading");
				console.log(err);
				$('#err').html('<div id="err-alert" class="alert alert-danger alert-dismissible fade in" style="width:50%; margin: 0 auto;"></div><br>');
				$("#err-alert").html(err.responseJSON.message);
				location.href = "#err-alert";
				$("#err-alert").fadeTo(5000, 500).slideUp(500, function(){
					$("#err-alert").slideUp(500);
				});
            }
        });
}

