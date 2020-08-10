$(".custom-file-input").on("change", function() {

    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

    var Upload = function (file) {
        this.file = file;
    };

    Upload.prototype.getType = function() {
        return this.file.type;
    };
    Upload.prototype.getSize = function() {
        return this.file.size;
    };
    Upload.prototype.getName = function() {
        return this.file.name;
    };
    Upload.prototype.doUpload = function () {

        var that = this;
        var formData = new FormData();


        // add assoc key values, this will be posts values
        formData.append("file", this.file, this.getName());
        formData.append("upload_file", true);
        formData.append("task",$('.custom-file-input').attr('data-task'));
        formData.append("project",$('.custom-file-input').attr('data-project'));
        //alert(formData);
        $.ajax({
            type: "POST",
            url: "/app/upload",
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', that.progressHandling, false);
                }
                return myXhr;
            },

            error: function (error) {
                console.log(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 200000000
          });

       };

        Upload.prototype.progressHandling = function (event) {
            var percent = 0;
            var position = event.loaded || event.position;
            var total = event.total;
            var progress_bar_id = "#progress-wrp";

            if (event.lengthComputable) {
                percent = Math.ceil(position / total * 100);
            }
            // update progressbars classes so it fits your code
            $('.progress.upload').slideDown(300);
            $('.progress.upload' + " .progress-bar").css("width", +percent + "%");
            $('.progress.upload' + " .progress-bar").text(percent + "%");
        };

        var files = Object.values($(this)[0].files);
        files.forEach(function(file){
          let upload = new Upload(file);
          upload.doUpload()
        })

   });

