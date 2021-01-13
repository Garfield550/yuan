// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.5.15;

import "../lib/IERC20.sol";
import "../lib/SafeERC20.sol";
import "../token/YUANTokenInterface.sol";

contract eETHReserves {
    // Token that serves as a reserve for YUAN
    address public reserveToken;

    address public gov;

    address public pendingGov;

    address public rebaser;

    address public yuanAddress;

    /*** Gov Events ***/

    /**
     * @notice Event emitted when pendingGov is changed
     */
    event NewPendingGov(address oldPendingGov, address newPendingGov);

    /**
     * @notice Event emitted when gov is changed
     */
    event NewGov(address oldGov, address newGov);

    /**
     * @notice Event emitted when rebaser is changed
     */
    event NewRebaser(address oldRebaser, address newRebaser);

    modifier onlyGov() {
        require(msg.sender == gov);
        _;
    }

    constructor(address reserveToken_, address yuanAddress_) public {
        reserveToken = reserveToken_;
        yuanAddress = yuanAddress_;
        gov = msg.sender;
    }

    function _setRebaser(address rebaser_) external onlyGov {
        address oldRebaser = rebaser;
        YUANTokenInterface(yuanAddress).decreaseAllowance(
            oldRebaser,
            uint256(-1)
        );
        rebaser = rebaser_;
        YUANTokenInterface(yuanAddress).approve(rebaser_, uint256(-1));
        emit NewRebaser(oldRebaser, rebaser_);
    }

    /** @notice sets the pendingGov
     * @param pendingGov_ The address of the gov contract to use for authentication.
     */
    function _setPendingGov(address pendingGov_) external onlyGov {
        address oldPendingGov = pendingGov;
        pendingGov = pendingGov_;
        emit NewPendingGov(oldPendingGov, pendingGov_);
    }

    /**
     * @notice lets msg.sender accept governance
     */
    function _acceptGov() external {
        require(msg.sender == pendingGov, "!pending");
        address oldGov = gov;
        gov = pendingGov;
        pendingGov = address(0);
        emit NewGov(oldGov, gov);
    }

    /// @notice Moves all tokens to a new reserve contract
    function migrateReserves(address newReserve, address[] memory tokens)
        public
        onlyGov
    {
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            uint256 bal = token.balanceOf(address(this));
            SafeERC20.safeTransfer(token, newReserve, bal);
        }
    }

    /**
     * @notice Approves an address to do a withdraw from this contract for specified amount
     */
    function whitelistWithdrawals(
        address[] memory whos,
        uint256[] memory amounts,
        address[] memory tokens
    )
        public
        onlyGov
    {
        require(whos.length == amounts.length, "Reserves::whitelist: !len parity 1");
        require(amounts.length == tokens.length, "Reserves::whitelist: !len parity 2");
        for (uint256 i = 0; i < whos.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            token.approve(whos[i], amounts[i]);
        }
    }

    function oneTimeTransfers(
        address[] memory whos,
        uint256[] memory amounts,
        address[] memory tokens
    )
        public
        onlyGov
    {
        require(whos.length == amounts.length, "Reserves::whitelist: !len parity 1");
        require(amounts.length == tokens.length, "Reserves::whitelist: !len parity 2");
        for (uint256 i = 0; i < whos.length; i++) {
            SafeERC20.safeTransfer(IERC20(tokens[i]), whos[i], amounts[i]);
        }
    }

    /// @notice Gets the current amount of reserves token held by this contract
    function reserves()
        public
        view
        returns (uint256)
    {
        return IERC20(reserveToken).balanceOf(address(this));
    }
}
