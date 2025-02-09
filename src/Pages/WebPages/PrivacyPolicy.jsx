import React from "react";
import WebHeader from "../../HeaderFooterSidebar/WebHeaderFooter/WebHeader";
import WebFooter from "../../HeaderFooterSidebar/WebHeaderFooter/WebFooter";
import TitleBg from "../../assets/img/web/title-bg.png";
import "./WebHome.css";
import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <>
      <div className="webWraper">
        <WebHeader />
        <div className="pageWraper privacyPolicyarea">
          <div className="privacyPolicy">
            <div className="container">
              <div className="privacyPolicyTitle">
                <img src={TitleBg} className="TitleBg" alt="TitleBg" />
                <h1>Privacy Policy</h1>
                <p>Last updated: Jan 2025</p>
              </div>
              <div className="privacyPolicyContent">
                Emmet Finance ("Emmet Finance") is committed to protecting and
                respecting your privacy. This Privacy Policy describes how your
                personal or behavioral data is collected, used, and stored when
                you access https://emmet.finance/ (the "Site").
                <br />
                <br />
                <h3>What does this Privacy Policy cover? </h3>
                This Privacy Policy sets forth our policy for collecting or
                using personal or behavioral data in connection with users
                accessing and using the Site.
                <br />
                <br />
                <h3>The Information We Collect</h3>
                Emmet Finance does not collect your personal information and
                does not use any automatic tracking technologies. The Emmet
                Finance application leverages blockchain technologies that use
                only public information available on the blockchain. You are not
                required to provide any personal information to the Site.
                However, the transactions conducted from your wallets are
                publicly accessible on blockchain networks accessed through the
                Site.
                <br />
                <br />
                Emmet Finance does not store any personal or messaging
                information or in any way use information to associate or
                cross-associate wallet data.
                <br />
                <br />
                Some Internet browsers include the ability to transmit "Do Not
                Track" or "DNT" signals. Since uniform standards for "DNT"
                signals have not been adopted, the Site does not currently
                process or respond to "DNT" signals.
                <br />
                <br />
                Emmet Finance will never collect your seed phrase or private
                keys. We will never ask you to share your wallet, private keys
                or seed phrase. Never trust anyone or any site that asks you to
                enter your private keys or similar security information.
                <br />
                <br />
                <b>Sharing of Personal Information</b>
                We do not share or sell the personal information that you
                provide us with other organizations without your express
                consent, except as described in this Privacy Policy.
                <br />
                <br />
                <b>How we Protect and Store Information</b>
                The safety and security of your personal information also
                depends on you. Unauthorized entry or use, hardware or software
                failure, and other factors may compromise the security of user
                information at any time.
                <br />
                <br />
                <b>International Transfers Of Personal Data</b>
                If you are a resident of the European Economic Area ("EEA") or
                Switzerland, you may have additional rights under the General
                Data Protection Regulation (the "GDPR") and other applicable
                laws with respect to your Personal Data, as outlined below.
                <br />
                <br />
                <b>Social Media</b>
                We may use social and developer networks such as Discord,
                Twitter, and Github. When you use them, the operators of the
                respective social and developer networks may record that you are
                on such networks. This processing of your personal data lies in
                the responsibility of these networks and occurs according to
                their privacy policies. Emmet Finance is not responsible for
                data collected by these networks. We only use these platforms to
                inform our community of updates and answer user questions.
                <br />
                <br />
                If you have any questions about this page or our data practices
                generally, please contact{" "}
                <a href="mailto:info@emmet.finance">info@emmet.finance</a>.
              </div>
            </div>
          </div>
        </div>
        <WebFooter />
      </div>
    </>
  );
}

export default PrivacyPolicy;
