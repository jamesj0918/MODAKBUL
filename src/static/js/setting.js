const DEPARTMENTS = ['데이터사이언스학과', '디자인이노베이션', '디지털콘텐츠학과', '만화애니메이션텍', '소프트웨어학과', '정보보호학과', '지능기전공학부', '창의소프트학부', '컴퓨터공학과'];
$(document).ready(()=>{
   let ajax = A_JAX(TEST_IP+'get_variables', "GET", null, null);
   $.when(ajax).done(()=>{

       let name = ajax.responseJSON.variables.filter(data => {
           return data.v_key === '학생회이름'
       });
       let subtitle = ajax.responseJSON.variables.filter(data => {
           return data.v_key === '학생회부제'
       });
       let image = ajax.responseJSON.variables.filter(data =>{
           return data.v_key === '학생회로고'
       });
       $('#M_union_name').attr('placeholder', name[0].value);
       $('#M_union_subtitle').attr('placeholder', subtitle[0].value);
       $('#M_image_preview').attr('src', '../static/image/'+image[0].value);
   });
   let filter = "win16|win32|win64|mac|macintel";
    if ( navigator.platform ) { //mobile
        if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) {
            $('body').css('overflow-y', 'auto');
        } else {
            $('.M_info').css('overflow-y', 'auto');
            $('.M_setting').css('height', '90%');
        }
    }

    let tag_ajax = A_JAX(TEST_IP+'get_access_tags', 'GET', null, null);
    $.when(tag_ajax).done(function() {
        for (let i=0; i<tag_ajax.responseJSON.tags.length; i++)
        {
            $('.M_tag_list').append(
                '<div class="M_tag_list_item">'+
                '<div class="M_tag_name" style="display:inline;"> # ' + tag_ajax.responseJSON.tags[i] + ' </div>'+
                '<i class="fas fa-trash-alt M_tag_icon_delete"></i>'+
                '<i onclick="modify_tag($(this).prev(), $(this))" class="fas fa-pencil-alt M_tag_icon_fixed"></i>'+
                '<i style="display: none;" class="fas fa-check M_tag_icon_delete"></i>'+
                '</div>'
            )
        }
    });

    black_list();

    let intro_ajax = A_JAX(TEST_IP+'get_department/0', 'GET', null, null);
    let result_html = '';
    $.when(intro_ajax).done(()=>{

        for (let i=0; i<intro_ajax.responseJSON.department.length; i++)
        {
            result_html +=
                '            <div class="M_bio_wrapper" style="overflow-y: scroll;height: 85%;">\n' +
                '                <div class="M_setting_subtitle_wrapper3">\n' +
                '                    <div class="M_settings_subtitle_wrapper">\n' +
                '                        <div class="M_setting_tag"></div>\n' +
                '                        <div class="M_setting_subtitle">사진</div>\n' +
                '                    </div>\n' +
                '                    <img id="M_principle_profile_pic-'+ intro_ajax.responseJSON.department[i].dm_id +'" onclick="profile_pic_upload(\'' + intro_ajax.responseJSON.department[i].dm_id + '\')\" src="../static/images/' + intro_ajax.responseJSON.department[i].dm_img + '" class="M_setting_introduce_image">\n' +
                '                    <input onchange="profile_change($(this), '+ intro_ajax.responseJSON.department[i].dm_id +')" id="M_principle_profile_upload-'+ intro_ajax.responseJSON.department[i].dm_id +'" type="file" style="display: none;">\n' +
                '                    <div class="M_image_warning_introduce">\n' +
                '                    대표 사진을 업로드해주세요!\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '                <div class="M_setting_subtitle_wrapper4">\n' +
                '                    <div class="M_settings_subtitle_wrapper">\n' +
                '                        <div class="M_setting_tag"></div>\n' +
                '                        <div class="M_setting_subtitle">직책</div>\n' +
                '                    </div>\n' +
                '                    <div class="M_position">\n' +
                '                        <input class="M_bio_input" disabled type="text" value="' + intro_ajax.responseJSON.department[i].dm_name + '">'+
                '                    </div>\n' +
                '                    <div class="M_settings_subtitle_wrapper">\n' +
                '                        <div class="M_setting_tag"></div>\n' +
                '                        <div class="M_setting_subtitle">정보</div>\n' +
                '                    </div>\n' +
                '                    <div class="M_manager">\n' +
                '                        <input class="M_bio_input" type="text" value="' + intro_ajax.responseJSON.department[i].dm_chairman +'">\n' +
                '                    </div>\n' +
                '                    <div class="M_settings_subtitle_wrapper">\n' +
                '                        <div class="M_setting_tag"></div>\n' +
                '                        <div class="M_setting_subtitle">소개</div>\n' +
                '                    </div>\n' +
                '                    <div class="M_manager_bio">\n' +
                '                        <textarea class="M_bio_input" style="height: 100px; margin-bottom: 0;" type="text" value="'+ intro_ajax.responseJSON.department[i].dm_intro +'"></textarea>\n' +
                '                    </div>\n' +
                '              </div>\n' +
                '            </div>';
        }
        $('#M_student_introduce_target').append(result_html);
    });
});

function black_list() {
    let black_ajax = A_JAX(TEST_IP+'get_blacklist', 'GET', null, null);
    $.when(black_ajax).done(()=>{
        result_html = '';
        for (let i=0; i<black_ajax.responseJSON.blacklist.length; i++) {
            let major = '';
            for (let j=0; j<DEPARTMENTS.length; j++)
            {
                if (black_ajax.responseJSON.blacklist[i].tags.indexOf(DEPARTMENTS[j]) !== -1) {
                    major = DEPARTMENTS[j];
                }
            }


            result_html += '<div class="M_black_user_info">' +
                '<div style="background-color: ' +  black_ajax.responseJSON.blacklist[i].user_color + '" class="M_setting_user_tag"></div>'+
                '<div class="M_setting_subtitle_name">'+
                black_ajax.responseJSON.blacklist[i].user_name + ' ' +
                black_ajax.responseJSON.blacklist[i].user_id + ' ' +
                major +
                '</div>'+
                '<div onclick="white_user($(this))" class="M_setting_unblack_button">취소</div></div>';
        }
        $('.M_setting_blacklist').append(result_html);
    })
}

function toggle(flag) {
    let info = $('.M_info');
    let principle_bio = $('.M_principle_bio');
    let bio = $('.M_bio');
    let user = $('.M_user');
    let menu = $('.M_menu');
    let tag = $('.M_tag');
    let password = $('.M_password');

    if (flag === 0){
        info.css('display', 'inline-block');
        principle_bio.css('display', 'none');
        bio.css('display', 'none');
        user.css('display', 'none');
        menu.css('display', 'none');
        tag.css('display', 'none');
        password.css('display', 'none');
    }
    else if (flag === 1){
        info.css('display', 'none');
        principle_bio.css('display', 'inline-block');
        bio.css('display', 'none');
        user.css('display', 'none');
        menu.css('display', 'none');
        tag.css('display', 'none');
        password.css('display', 'none');
    }
    else if (flag === 2){
        info.css('display', 'none');
        principle_bio.css('display', 'none');
        bio.css('display', 'inline-block');
        user.css('display', 'none');
        menu.css('display', 'none');
        tag.css('display', 'none');
        password.css('display', 'none');
    }
    else if (flag === 3){
        info.css('display', 'none');
        principle_bio.css('display', 'none');
        bio.css('display', 'none');
        user.css('display', 'inline-block');
        menu.css('display', 'none');
        tag.css('display', 'none');
        password.css('display', 'none');
    }
    else if (flag === 4){
        info.css('display', 'none');
        principle_bio.css('display', 'none');
        bio.css('display', 'none');
        user.css('display', 'none');
        menu.css('display', 'inline-block');
        tag.css('display', 'none');
        password.css('display', 'none');
    }
    else if (flag === 5){
        info.css('display', 'none');
        principle_bio.css('display', 'none');
        bio.css('display', 'none');
        user.css('display', 'none');
        menu.css('display', 'none');
        tag.css('display', 'inline-block');
        password.css('display', 'none');
    }
    else if (flag === 6){
        info.css('display', 'none');
        principle_bio.css('display', 'none');
        bio.css('display', 'none');
        user.css('display', 'none');
        menu.css('display', 'none');
        tag.css('display', 'none');
        password.css('display', 'inline-block');
    }
}

function modify_tag(tag) {
    tag.replaceWith('<input type="text" style="width:30%"></input>');
}

function upload_logo() {
    $('#M_logo_upload').trigger('click');
}

let image;
function image_preview(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function(e) {
            $('#M_image_preview').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        image = input.files;
    }
}

function profile_pic_upload(id) {
    let target = $('#M_principle_profile_upload-'+id);
    target.trigger('click');
}

function profile_change(target, id) {
    let image = $('#M_principle_profile_pic-'+id);
    target = target[0];
    if (target.files && target.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            image.attr('src', e.target.result);
        };
        reader.readAsDataURL(target.files[0]);
    }
}

let image_updated = false;
let name_updated = false;
let subtitle_updated = false;
let main_bio_updated = false;
let contacts_updated = false;

$('#M_logo_upload').change(function () {
   image_preview(this);
   image_updated = true;
});

$('#M_union_name').change(()=>{
    name_updated = true;
});

$('#M_union_subtitle').change(()=>{
    subtitle_updated = true;
});

$('#M_union_info_wrapper_introduce_textarea').change(()=>{
    main_bio_updated = true;
});

$('#M_union_info_wrapper_phonenumber_textarea').change(()=>{
    contacts_updated = true;
});

function submit_bio() {
    if (image_updated === true)
    {
        let img_data = new FormData();
        img_data.append('img', image[0]);
        let img_ajax = A_JAX_FILE(TEST_IP+'change_logo', 'POST', localStorage.getItem('modakbul_token'), img_data);
        $.when(img_ajax).done(()=>{
            location.reload();
        })
    }
    if (name_updated === true)
    {
        let div = $('#M_union_name');
        let new_name = div.val();
        let name_data = {'key': '학생회이름', 'value': div.val()};
        let name_ajax = A_JAX(TEST_IP+'variable_update', 'POST', null, name_data);
        $.when(name_ajax).done(()=>{
            div.val('');
            div.attr('placeholder', new_name);
        });
        snackbar('적용되었습니다.');
    }
    if (subtitle_updated === true)
    {
        let div = $('#M_union_subtitle');
        let new_subtitle = div.val();
        let subtitle_data = {'key': '학생회부제', 'value': div.val()};
        let subtitle_ajax = A_JAX(TEST_IP+'variable_update', 'POST', null, subtitle_data);
        $.when(subtitle_ajax).done(()=>{
            div.val('');
            div.attr('placeholder', new_subtitle);
        });
        snackbar('적용되었습니다.');
    }
    if (main_bio_updated === true)
    {
        let introduce_textarea_value; // 학생회 소개 textarea
        let tmp;
        tmp =  $('#M_union_info_wrapper_introduce_textarea').val();
        introduce_textarea_value = tmp.replace(/\n/g, "<br />");

        let main_bio_data = {'key': '총인사말', 'value': introduce_textarea_value};
        let main_bio_ajax = A_JAX(TEST_IP+'variable_update', 'POST', null, main_bio_data);
        $.when(main_bio_ajax).done(()=>{
            $('#M_union_info_wrapper_introduce_textarea').val('');
            $('#M_union_info_wrapper_introduce_textarea').attr('placeholder', tmp);
        });
        snackbar('적용되었습니다.');
    }
    if (contacts_updated === true)
    {
        let contacts_textarea_value; // 학생회 소개 textarea
        let tmp;
        tmp =  $('#M_union_info_wrapper_phonenumber_textarea').val();
        contacts_textarea_value = tmp.replace(/\n/g, "<br />");

        let contacts_data = {'key': '연락처', 'value': contacts_textarea_value};
        let contacts_ajax = A_JAX(TEST_IP+'variable_update', 'POST', null, contacts_data);
        $.when(contacts_ajax).done(()=> {
            $('#M_union_info_wrapper_phonenumber_textarea').val('');
            $('#M_union_info_wrapper_phonenumber_textarea').attr('placeholder', tmp);
        });
        snackbar('적용되었습니다.');
    }
}
function settingsPage_check_admin() {
    let a_jax = A_JAX(TEST_IP+"get_userinfo", "GET", null, null);
    $.when(a_jax).done(function(){
        let json = a_jax.responseJSON;
        if (json['result'] == "success"){
            //You are admin!
        } else {
            alert("접근 권한이 없습니다.");
            location.href = "/";
        }
    });
    $.when(a_jax).fail(function(){
        alert("접근 권한이 없습니다.");
        location.href = "/";
    });
}
function search_user() {
    let search = $('.M_user_search').val();
    let ajax = A_JAX(TEST_IP+"get_user_search", "POST", null, {'search': search});
    let result_html = '';
    $.when(ajax).done(()=>{
        if (ajax.responseJSON.result === 'user is not defined') {
            snackbar('사용자가 없습니다.')
        }
        else {
            let major = '';
            for (let j=0; j<DEPARTMENTS.length; j++)
            {
                if (ajax.responseJSON.user_tags.indexOf(DEPARTMENTS[j]) !== -1) {
                    major = DEPARTMENTS[j];
                }
            }

            result_html +=
                '<div style="background-color: ' +  ajax.responseJSON.user.user_color + '" class="M_setting_user_tag"></div>'+
                '<div class="M_setting_subtitle_name">'+
                ' ' + ajax.responseJSON.user.user_name + ' ' + ajax.responseJSON.user.user_id + ' '+ major +
                '</div>'+
                '<div onclick="black_user($(this).parent())" class = "M_setting_black_button"> 블랙</div>';
            $('#M_user_info').empty();
            $('#M_user_info').append(result_html);
        }
    })
}

$('.M_user_search').keypress(function (e) {
    let key = e.which;
    if(key === 13)
    {
        search_user();
    }
});

function black_user(div) {
    let ajax = A_JAX(TEST_IP+"user_black_apply", "POST", null, {'target_id': div[0].childNodes[1].innerText.split(' ')[1]});
    $.when(ajax).done(()=>{
        if (ajax.responseJSON.result === 'already blacklist') {
            snackbar('이미 블랙리스트에 추가된 사용자 입니다.');
            $('#M_user_info').empty();
        }
        else {
            $('#M_user_info').empty();
            $('.M_setting_blacklist').empty();
            black_list();
        }
    })
}
function white_user(div) {
    let ajax = A_JAX(TEST_IP+"user_black_cancel", "POST", null, {'target_id': div.parent()[0].childNodes[1].innerText.split(' ')[1]});
    $.when(ajax).done(()=>{
        if (ajax.responseJSON.result === 'no blacklist') {
            snackbar('이미 블랙리스트에서 제거된 사용자 입니다.');
        }
        $('.M_setting_blacklist').empty();
        black_list();
    })
}
function change_password() {
    let prev_pw = $('#prev_pw').val();
    let new_pw = $('#new_pw').val();
    let new_pw_confirm = $('#new_pw_confirm').val();

    if (prev_pw === '') {
        alert('이전 비밀번호를 입력해주세요.');
        return;
    }
    else if (new_pw === '') {
        alert('새 비밀번호를 입력해주세요.');
        return;
    }
    else if (new_pw_confirm === '') {
        alert('새 비밀번호를 확인해주세요.');
        return;
    }

    let data = {'old_pw': prev_pw, 'new_pw_1': new_pw, 'new_pw_2': new_pw_confirm};

    let ajax = A_JAX(TEST_IP+"change_pw", "POST", null, data);
    $.when(ajax).done(()=>{
        if (ajax.responseJSON.result === 'not same pw') {
            snackbar('새 비밀번호가 일치하지 않습니다.')
        }
        else if (ajax.responseJSON.result === 'wrong old pw') {
            snackbar('이전 비밀번호가 일치하지 않습니다.')
        }
    })

}


function update_principle_bio() {
    let list = [];
    for (let i=0; i< $('#M_student_introduce_target')[0].childNodes.length; i++){
        if ($('#M_student_introduce_target')[0].childNodes[i].className === 'M_bio_wrapper') list.push($('#M_student_introduce_target')[0].childNodes[i]);
    }
    let send_data = [];

    for (let i=0; i<list.length; i++) {
        let image = $(list[i].children[0].children[2])[0].files[0];
        let name = $(list[i].children[1].children[1].children[0]).val();
        let info =$(list[i].children[1].children[3].children[0]).val();
        let bio = $(list[i].children[1].children[5].children[0]).val();
        let id = $(list[i].children[0].children[2])[0].id.split('-')[1];
        bio = bio.replace(/\n/g, "<br />");
        console.log(name);
        console.log(info);
        console.log(bio);
        console.log(id);

        let data = new FormData();
        /*
        data['dm_id'] = id;
        data['dm_name'] = info;
        data['dm_chairman'] = name;
        data['dm_intro'] = bio;
        data['dm_type'] = 0;
        */

        data.append('dm_id', id);
        data.append('dm_name', name);
        data.append('dm_chairman', info);
        data.append('dm_intro', bio);
        data.append('dm_type', 0);
        data.append('dm_img', image);

        console.log(image);


        let ajax = A_JAX_FILE(TEST_IP+"department_update", "POST", null, data);
        $.when(ajax).done(()=>{
            console.log(ajax.responseJSON);
        });
    }

}

function add_intro() {

}











