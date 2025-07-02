## Creating a simple Git automation job in Jenkins using GitHub with HTTPS authentication and a Personal Access Token (PAT).

**Prerequisites:**

*   **Jenkins Installed and Running:** You have a working Jenkins instance.
*   **Git Installed on Jenkins Agent(s):** Git is installed and accessible in the PATH on the Jenkins agent(s) that will run your job.
*   **Jenkins Git Plugin:** Ensure the Git plugin is installed in Jenkins (usually is by default).
*   **GitHub Repository:** You have a GitHub repository that you want to automate builds for.
*   **GitHub Personal Access Token (PAT):** You have generated a PAT from your GitHub account with appropriate permissions (at least read access to your repositories).

---

### Step-by-Step Guide: Simple GitHub Git Automation Job in Jenkins

**Step 1: Generate your GitHub Personal Access Token (PAT)**

This is the most crucial security step. **Do NOT use your GitHub account password.**

1.  **Log in to your GitHub account.**
2.  Go to your **profile picture** (top right) and click on **Settings**.
3.  In the left-hand sidebar, scroll down to **Developer settings** and click on it.
4.  Click on **Personal access tokens** -> **Tokens (classic)** (or **Fine-grained tokens** if you prefer more granular control, but for a simple job, classic is fine).
5.  Click the **"Generate new token"** button.
6.  **Give your token a descriptive name**, e.g., `Jenkins-Build-Access`.
7.  **Set an expiration date** for the token. Choose a reasonable period (e.g., 90 days, 1 year).
8.  **Select the necessary scopes (permissions):**
    *   For a typical build job that only needs to fetch code, you'll need at least:
        *   `repo` (read:user, read:org, read:public_key, read:repo_hook, **read:repository**, read:ssh_signing_key, read:status, read:subscription, **read:code**, read:gpg_key, **contents:read**, **metadata:read**) - **The `contents:read` and `metadata:read` are key for fetching code.** If your job needs to *push* changes, you'll need `contents:write`.
        *   *(If you are unsure, start with `repo` and `read:user`, you can refine later if needed.)*
9.  Click **"Generate token"**.
10. **IMPORTANT:** **Copy the generated token immediately.** You will not be able to see it again. Store it securely in a password manager or a secure note.

**Step 2: Create a New Jenkins Job**

1.  **Open your Jenkins dashboard.**
2.  Click on **"New Item"** in the left-hand menu.
3.  Enter a descriptive **Item name** for your job (e.g., `MyGitHubAutoJob`).
4.  Select **"Freestyle project"** as the project type.
5.  Click **"OK"**.

**Step 3: Configure the Job - Source Code Management**

1.  You are now on the job's configuration page. Scroll down to the **"Source Code Management"** section.
2.  Select **"Git"** from the dropdown menu.
3.  **Repository URL:**
    *   Go to your GitHub repository page.
    *   Click the green **"Code"** button.
    *   Select **HTTPS** as the clone URL.
    *   Copy the HTTPS URL. It will look like: `https://github.com/your-username/your-repo.git`
    *   Paste this URL into the **"Repository URL"** field in Jenkins.
4.  **Credentials:**
    *   Click the **"Add"** dropdown next to the "Credentials" field.
    *   Select **"Jenkins"**.
    *   In the "Add Credential" dialog:
        *   **Kind:** Select **"Username with password"**.
        *   **Username:** Enter your GitHub **username**.
        *   **Password:** Paste the **Personal Access Token (PAT)** you copied in Step 1.
        *   **ID:** Give this credential a descriptive ID (e.g., `github-pat-jenkins`). This ID is used internally by Jenkins.
        *   Click **"Add"**.
    *   Once the credential is added, select the **newly added credential ID** (e.g., `github-pat-jenkins`) from the "Credentials" dropdown.
5.  **Branches to build:**
    *   In the **"Branch Specifier"** field, enter the branch you want Jenkins to monitor and build. For example:
        *   `*/main` (if your default branch is `main`)
        *   `*/master` (if your default branch is `master`)
        *   `*/develop` (to monitor a specific `develop` branch)
        *   You can use wildcards like `*/feature/*` to build all feature branches.

**Step 4: Configure the Job - Build Triggers**

This determines *when* your job runs.

1.  Scroll down to the **"Build Triggers"** section.
2.  **For simple polling:**
    *   Check the **"Poll SCM"** box.
    *   In the **"Schedule"** field, enter a cron-like syntax to define how often Jenkins should check for changes.
        *   **Example:** `H/5 * * * *`
            *   This will poll your repository every 5 minutes. `H` means Jenkins will choose a random minute within that interval to reduce load on the SCM.
3.  **For more efficient builds (GitHub Webhooks - Recommended if possible):**
    *   If you want Jenkins to be notified immediately when changes are pushed, you can use webhooks.
    *   Check **"GitHub hook trigger for GITScm polling"**.
    *   *(Note: This requires configuring a webhook in your GitHub repository settings to point to your Jenkins instance. This is beyond the scope of this simple job setup but is a more performant approach.)*

**Step 5: Configure the Job - Build Steps**

This is where you define what commands Jenkins should execute when a build is triggered.

1.  Scroll down to the **"Build"** section.
2.  Click the **"Add build step"** dropdown.
3.  Select **"Execute shell"** (for Linux/macOS agents) or **"Execute Windows batch command"** (for Windows agents).
4.  In the text area provided for the build step, enter your commands. Here are some simple examples:

    **Example 1: Just Fetch and Print Latest Commit**

    ```bash
    echo --- Fetching latest code ---

    REM Jenkins already checked out the latest commit

    echo --- Build Information ---
    echo Branch being built: origin/main

    FOR /F "delims=" %%G IN ('git rev-parse HEAD') DO SET COMMIT_HASH=%%G
    echo Latest commit hash: %COMMIT_HASH%

    echo Build Number: %BUILD_NUMBER%

    ```

**Step 6: Save the Job Configuration**

1.  Scroll to the bottom of the configuration page and click the **"Save"** button.

**Step 7: Test the Job**

1.  Go back to the main page for your newly created job.
2.  On the left-hand side, click **"Build Now"** to manually trigger a build.
3.  Watch the **"Build History"** on the left. A new build will appear.
4.  Click on the build number, then click **"Console Output"** to see the logs and verify that Git operations are working correctly and your build steps are executing.

You have now created a simple Jenkins job that automates building based on changes in your GitHub repository using HTTPS and a Personal Access Token!



Let's break down what you've achieved and the underlying concepts.

### What Was Done Here?

You have configured a **Jenkins Freestyle project** to perform the following actions:

1.  **Connect to a GitHub Repository:** Jenkins is set up to communicate with your GitHub repository using its **HTTPS URL**.
2.  **Authenticate with GitHub:** Jenkins securely uses your **GitHub username** and a **Personal Access Token (PAT)** to authenticate with GitHub, allowing it to fetch code.
3.  **Monitor for Changes:** Jenkins is configured to periodically **poll your specified branch** (`*/main`, `*/master`, etc.) in the GitHub repository for new commits.
4.  **Checkout Code:** When changes are detected, Jenkins automatically **clones or pulls the latest code** from your repository onto the Jenkins agent.
5.  **Execute Build Steps:** After fetching the code, Jenkins runs a series of **shell commands** (or batch commands) that you defined. These commands could be anything from printing information, compiling code, running tests, installing dependencies, or any other task you automate.

### Learning Goals Achieved:

By following these steps, you've learned and applied several fundamental concepts related to CI/CD and Jenkins:

1.  **Continuous Integration (CI) Fundamentals:**
    *   **Automated Source Code Management:** Understanding how to connect a build system to a version control system (Git/GitHub).
    *   **Automated Building:** Learning to trigger builds automatically based on code changes.
    *   **SCM Polling (and awareness of Webhooks):** Understanding methods to detect code updates.
    *   **Secure Credential Management:** Recognizing the importance of using PATs over passwords and how Jenkins stores them securely.

2.  **Jenkins Job Configuration:**
    *   **Freestyle Project:** Understanding how to create and configure the most basic and versatile Jenkins project type.
    *   **Source Code Management (SCM) Configuration:** Mastering how to tell Jenkins where your code is and how to access it.
    *   **Build Triggers:** Learning how to define when a job should execute.
    *   **Build Steps:** Understanding how to script actions that Jenkins will perform.
    *   **Environment Variables:** Recognizing that Jenkins injects useful variables into the build environment (like `${GIT_BRANCH}`, `${BUILD_NUMBER}`).

3.  **Git & GitHub Workflow:**
    *   **HTTPS URLs for Git:** Understanding how to use HTTPS to interact with Git repositories.
    *   **Personal Access Tokens (PATs):** Learning their purpose and how to generate/use them for API and tool access.
    *   **`git pull` Command:** Basic understanding of how to fetch and merge remote changes.

### Use of Jenkins in This Scenario:

Jenkins acts as the **central orchestrator** for your automated workflow. Its primary uses here are:

1.  **Automation Server:** Jenkins automates repetitive tasks that would otherwise be manual and error-prone. Instead of you manually fetching code and running build commands every time someone commits, Jenkins does it for you.
2.  **Version Control Integration:** It bridges the gap between your code stored in GitHub and the actual process of building or processing that code.
3.  **Triggering and Scheduling:** It provides the intelligence to know *when* to act – either by checking at regular intervals (polling) or being notified instantly (webhooks).
4.  **Execution Environment:** Jenkins provides the environment (the agent) where your Git commands and build scripts are run.
5.  **Feedback Mechanism:** Through its logging and build history, Jenkins provides feedback on whether the automated process succeeded or failed, allowing you to quickly identify issues with your code or build process.

In essence, Jenkins is transforming your manual development cycle into a more automated and efficient **Continuous Integration pipeline**, even in this simple form. It's the first step towards more sophisticated CI/CD practices like automated testing, deployment, and more.