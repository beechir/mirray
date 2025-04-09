import '/auth/firebase_auth/auth_util.dart';
import '/backend/backend.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import '/index.dart';
import 'create_account_widget.dart' show CreateAccountWidget;
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class CreateAccountModel extends FlutterFlowModel<CreateAccountWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for username_signup widget.
  FocusNode? usernameSignupFocusNode;
  TextEditingController? usernameSignupTextController;
  String? Function(BuildContext, String?)?
      usernameSignupTextControllerValidator;
  // State field(s) for email_signup widget.
  FocusNode? emailSignupFocusNode;
  TextEditingController? emailSignupTextController;
  String? Function(BuildContext, String?)? emailSignupTextControllerValidator;
  // State field(s) for password_signup widget.
  FocusNode? passwordSignupFocusNode;
  TextEditingController? passwordSignupTextController;
  late bool passwordSignupVisibility;
  String? Function(BuildContext, String?)?
      passwordSignupTextControllerValidator;
  // State field(s) for phonenumber widget.
  FocusNode? phonenumberFocusNode;
  TextEditingController? phonenumberTextController;
  String? Function(BuildContext, String?)? phonenumberTextControllerValidator;

  @override
  void initState(BuildContext context) {
    passwordSignupVisibility = false;
  }

  @override
  void dispose() {
    usernameSignupFocusNode?.dispose();
    usernameSignupTextController?.dispose();

    emailSignupFocusNode?.dispose();
    emailSignupTextController?.dispose();

    passwordSignupFocusNode?.dispose();
    passwordSignupTextController?.dispose();

    phonenumberFocusNode?.dispose();
    phonenumberTextController?.dispose();
  }
}
